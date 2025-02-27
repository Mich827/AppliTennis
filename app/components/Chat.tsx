"use client";

import { useState, useEffect, useCallback } from "react";

export const dynamic = 'force-dynamic';

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string;
}

interface User {
  id: number;
  name: string;
}

export default function Chat({ userId }: { userId: number }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<number | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!selectedRecipient) return;

    try {
      const response = await fetch(`/api/messages?userId=${userId}&recipientId=${selectedRecipient}`, {
        cache: 'no-store'
      });
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Erreur lors du chargement des messages :", error);
    }
  }, [userId, selectedRecipient]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/users", {
        cache: 'no-store'
      });
      const data = await response.json();

      if (data.length > 0) {
        setUsers(data);
        setSelectedRecipient(data[0].id); // Sélectionne le premier utilisateur
      }
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs :", error);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (selectedRecipient) {
      fetchMessages();
    }
  }, [selectedRecipient, fetchMessages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedRecipient) return;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: userId, receiverId: selectedRecipient, content: newMessage }),
      });

      if (response.ok) {
        setNewMessage("");
        fetchMessages();
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 border rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">💬 Messagerie</h2>

      {/* Sélection du destinataire */}
      {users.length > 0 ? (
        <select
          className="w-full p-2 border rounded-lg mb-4"
          value={selectedRecipient || ""}
          onChange={(e) => setSelectedRecipient(parseInt(e.target.value))}
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      ) : (
        <p className="text-gray-600">Aucun utilisateur trouvé.</p>
      )}

      {/* Zone des messages */}
      <div className="h-64 overflow-y-auto border p-2 rounded-lg mb-4">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-2 my-1 rounded-md ${
                msg.senderId === userId ? "bg-blue-500 text-white self-end" : "bg-gray-300"
              }`}
            >
              {msg.content}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">Aucun message</p>
        )}
      </div>

      {/* Envoi de message */}
      <div className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow border p-2 rounded-lg"
          placeholder="Écrire un message..."
        />
        <button onClick={sendMessage} className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-lg">
          Envoyer
        </button>
      </div>
    </div>
  );
}
