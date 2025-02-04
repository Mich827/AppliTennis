// pages/api/sendEmail.ts
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userEmail, court, hour, date } = req.body;

    // Crée un transporteur pour Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Tu peux remplacer par un autre service d'email comme Mailgun, SendGrid, etc.
      auth: {
        user: process.env.EMAIL_USER,  // Ton email
        pass: process.env.EMAIL_PASS,  // Ton mot de passe ou clé API
      },
    });

    // Définition des options pour l'email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Confirmation de réservation de court',
      text: `Bonjour,

      Votre réservation a bien été confirmée !

      Court réservé: ${court}
      Heure: ${hour}h - ${hour + 1}h
      Date: ${date}

      Merci et à bientôt sur nos courts !`,
    };

    // Envoi de l'email
    try {
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: 'Email envoyé avec succès' });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      return res.status(500).json({ message: 'Erreur d\'envoi de l\'email' });
    }
  } else {
    return res.status(405).json({ message: 'Méthode HTTP non autorisée' });
  }
}
