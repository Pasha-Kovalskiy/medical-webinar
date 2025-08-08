import { connectDB } from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    console.log('Получен запрос на сервер.');
    const { email, password, username } = await req.json();

    if (!email || !password || !username) {
      console.log('Проблема з поштою, паролем або імям користувача.');
      return new Response(
        JSON.stringify({
          error: `Пошта, пароль та ім'я користувача - необхідні.`,
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    await connectDB();

    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
      console.log('Пробема з поштою(користувач вже існує)');
      return new Response(
        JSON.stringify({ emailError: `Користувач з такою поштою вже існує.` }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      console.log('Проблема з іменем(користувач вже існує).');
      return new Response(
        JSON.stringify({
          usernameError: `Користувач з таким ім'ям вже існує.`,
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: 'user',
    });

    console.log('Користвача зареєстровано.');
    return new Response(
      JSON.stringify({ message: 'Користувач успішно зареєстрований.' }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.log('Помилка в блоці try/catch.');
    console.error(error);
    return new Response(JSON.stringify({ error: 'Щось пішло не так.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
