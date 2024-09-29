import cron from 'node-cron';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Cron job to check for scheduled messages every minute
cron.schedule('* * * * *', async () => {
  const client = await clientPromise;
  const db = client.db();

  const now = new Date();

  try {
    // Find messages that are scheduled to be sent and are not yet sent
    const scheduledMessages = await db.collection('messages').find({
      scheduleDate: { $lte: now },
      sent: false,
    }).toArray();

    for (const message of scheduledMessages) {
      // Mark the message as sent
      await db.collection('messages').updateOne(
        { _id: new ObjectId(message._id) },
        { $set: { sent: true } }
      );

      // Here, you could send a notification or trigger the actual sending of the message
      console.log(`Message with ID ${message._id} sent at ${now}`);
    }
  } catch (error) {
    console.error('Error sending scheduled messages:', error);
  }
});
