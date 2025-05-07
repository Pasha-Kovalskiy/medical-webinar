import { connectDB } from '@/lib/mongoose';
import Webinar from '@/models/Webinar';

export async function GET() {
  try {
    await connectDB();

    const webinars = await Webinar.find();

    return new Response(JSON.stringify(webinars), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Ошибка загрузки вебинаров...' }),
      {
        status: 500,
      }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const newWebinar = new Webinar(body);
    const savedWebinar = await newWebinar.save();

    return new Response(
      JSON.stringify(savedWebinar, {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      })
    );
  } catch (error) {
    console.error('Ошибка при добавлении вебинара', error);
    return new Response('Ошибка сервера', { status: 500 });
  }
}
