// pages/booking.tsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker"; // Si tu utilises react-datepicker
import "react-datepicker/dist/react-datepicker.css";

// Liste des courts et des heures disponibles
const courts = ["Court 1", "Court 2", "Court 3", "Court 4", "Court 5"];
const hours = Array.from({ length: 12 }, (_, i) => 9 + i); // De 9h à 20h

const Booking = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // Date sélectionnée
  const [reservations, setReservations] = useState<Record<string, { reserved: boolean, userName?: string, reservationId?: number }>>({});
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(parseInt(storedUserId));
    }
  }, []);

  // Récupération des réservations pour la date sélectionnée
  useEffect(() => {
    const fetchReservations = async () => {
      const formattedDate = selectedDate.toISOString().split("T")[0];

      try {
        const response = await fetch(`/api/getAllReservations?date=${formattedDate}`);

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des réservations");
        }

        const data = await response.json();

        const newReservations: Record<string, { reserved: boolean, userName?: string, reservationId?: number }> = {};
        data.reservations.forEach((res) => {
          newReservations[`${res.court}-${res.startTime}`] = {
            reserved: true,
            userName: res.userName,
            reservationId: res.id, // Stocke l'ID de la réservation pour l'annulation
          };
        });

        setReservations(newReservations);
      } catch (error) {
        console.error("Erreur :", error);
      }
    };

    fetchReservations();
  }, [selectedDate]);

  const handleBooking = async (court: string, hour: number) => {
    if (!userId) {
      toast.error("Vous devez être connecté pour réserver.");
      return;
    }

    const key = `${court}-${hour}`;
    const existingReservation = reservations[key];

    if (existingReservation?.reserved) {
      const confirmCancel = window.confirm(`Voulez-vous annuler la réservation de ${existingReservation.userName} ?`);
      if (!confirmCancel) return;

      try {
        const response = await fetch(`/api/deleteReservation`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reservationId: existingReservation.reservationId,
          }),
        });

        if (!response.ok) {
          throw new Error("Erreur lors de l'annulation");
        }

        setReservations((prev) => {
          const updatedReservations = { ...prev };
          delete updatedReservations[key];
          return updatedReservations;
        });

        toast.success("Réservation annulée !");
      } catch (error) {
        toast.error("Erreur de serveur");
      }
    } else {
      try {
        const response = await fetch("/api/booking", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            court,
            date: selectedDate.toISOString().split("T")[0], // Utilise la date sélectionnée
            startTime: hour,
            userId,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setReservations((prev) => ({
            ...prev,
            [key]: { reserved: true, userName: data.reservation.userName, reservationId: data.reservation.id },
          }));

          // Envoie un email après la réservation
          const userEmail = localStorage.getItem("userEmail");
          if (userEmail) {
            await sendReservationEmail(userEmail, court, hour, selectedDate.toLocaleDateString("fr-FR"));
          }

          toast.success("Réservation réussie !");
        } else {
          toast.error(data.error || "Erreur de réservation");
        }
      } catch (error) {
        toast.error("Erreur de serveur");
      }
    }
  };

  const sendReservationEmail = async (userEmail: string, court: string, hour: number, date: string) => {
    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail, court, hour, date }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Email envoyé');
      } else {
        console.error('Erreur d\'envoi de l\'email:', data.message);
      }
    } catch (error) {
      console.error('Erreur d\'envoi de l\'email:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Réservation des courts 🎾
      </h2>

      {/* 📅 Sélecteur de date */}
      <div className="text-center mb-6">
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date) => setSelectedDate(date)}
          minDate={new Date()} // Pour interdire la réservation dans le passé
          dateFormat="dd/MM/yyyy"
          className="border p-2 rounded"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-4">Heures</th>
              {courts.map((court) => (
                <th key={court} className="p-4">{court}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map((hour) => (
              <tr key={hour} className="border-t">
                <td className="p-4 text-center text-lg md:text-xl font-bold text-gray-900 bg-gray-200">
                  {hour}h - {hour + 1}h
                </td>
                {courts.map((court) => {
                  const key = `${court}-${hour}`;
                  return (
                    <td key={key} className="p-2">
                      <button
                        className={`w-full p-3 text-sm md:text-base font-semibold rounded-lg shadow-md transition ${
                          reservations[key]?.reserved ? "bg-red-500 text-white" : "bg-green-500 text-white hover:bg-green-600"
                        }`}
                        onClick={() => handleBooking(court, hour)}
                      >
                        {reservations[key]?.reserved
                          ? `Réservé par ${reservations[key]?.userName} (Annuler)`
                          : `${court} - Réserver`}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Booking;
