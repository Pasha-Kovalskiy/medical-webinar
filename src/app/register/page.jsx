'use client';

import styles from './page.module.css';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import Logo from '@/components/icons/logo/logo.component';
import Spinner from '@/components/Spinner/Spinner.component';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    reenterPassword: '',
  });
  const [errors, setErrors] = useState({
    username: [],
    email: [],
    password: [],
    reenterPassword: [],
  });
  const [formErrors, setFormErrors] = useState([]);
  const [success, setSuccess] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isPrimitive = (value) => {
    return (
      value === null ||
      (typeof value !== 'object' && typeof value !== 'function')
    );
  };

  const checkForErrorsAmount = (errors) => {
    let errorsAmount = 0;
    for (const key in errors) {
      if (Array.isArray(errors[key])) {
        errorsAmount += errors[key].length;
      } else if (isPrimitive(errors[key])) {
        if (errors[key] !== null && errors[key] !== undefined) {
          errorsAmount++;
        }
      }
    }
    return errorsAmount;
  };

  const validateUsername = (username, usernameErrorsArr) => {
    if (username.trim().length < 6)
      usernameErrorsArr.push(
        'Мінімальна довжина імені користувача - 6 символів.'
      );
  };

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateEmail = (email, emailErrorsArr) => {
    if (!isValidEmail(email.trim()))
      emailErrorsArr.push('Email введений не корректно.');
  };

  const validatePassword = (password, passwordErrorsArr) => {
    if (password.trim().length < 6)
      passwordErrorsArr.push('Мінімальна довижина паролю - 6 символів.');
  };

  const validateReenterPassword = (
    password,
    reenterPassword,
    reenterPasswordErrorsArr
  ) => {
    if (password !== reenterPassword)
      reenterPasswordErrorsArr.push('Введені паролі не співпадають.');
  };

  const validateForm = (errors) => {
    let errorsAmount = 0;

    validateUsername(formData.username, errors.username);
    validateEmail(formData.email, errors.email);
    validatePassword(formData.password, errors.password);
    validateReenterPassword(
      formData.password,
      formData.reenterPassword,
      errors.reenterPassword
    );

    errorsAmount = checkForErrorsAmount(errors);
    return {
      errors: errors,
      errorsAmount: errorsAmount,
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {
      username: [],
      email: [],
      password: [],
      reenterPassword: [],
    };
    setErrors(newErrors);
    const newFormErrors = [];
    setFormErrors(newFormErrors);

    const { errors, errorsAmount } = validateForm(newErrors);
    setErrors(errors);
    if (errorsAmount !== 0) {
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsLoading(false);
        if (data.hasOwnProperty('error')) {
          setFormErrors((prev) => [...prev, data.error]);
        }

        if (data.hasOwnProperty('usernameError')) {
          setErrors((prev) => ({
            ...prev,
            username: [...prev.username, data.usernameError],
          }));
        }

        if (data.hasOwnProperty('emailError')) {
          setErrors((prev) => ({
            ...prev,
            email: [...prev.email, data.emailError],
          }));
        }
      }

      setIsLoading(false);
      setSuccess(data.message);
      setFormData({
        username: '',
        email: '',
        password: '',
        reenterPassword: '',
      });
    } catch (error) {
      setIsLoading(false);
      console.error(`Помилка реєстрації: ${error}`);
      setFormErrors((prev) => [...prev, `Помилка при з'єднанні з сервером.`]);
    }
  };

  const renderErrors = (field) => {
    return (
      <ul className={styles.errorsList}>
        {errors[field]?.map((error, index) => (
          <li key={index} className={styles.errorsItem}>
            {error}
          </li>
        ))}
      </ul>
    );
  };

  const renderFormErrors = () => {
    return (
      <ul className={styles.errorsList}>
        {formErrors.map((error, index) => (
          <li key={index} className={styles.errorsItem}>
            {error}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className={styles.register}>
      <div className={styles.register__container}>
        <div className={`${styles.register__left} ${styles.left}`}>
          <div className={styles.left__content}>
            <div className={styles.left__logo}>
              <Link href={'/'}>
                <Logo />
              </Link>
            </div>
            <p className={styles.left__text}>
              Реєструйся просто зараз щоб навчатися у нас!
            </p>
          </div>
        </div>

        <div className={styles.register__right}>
          {isLoading && <Spinner />}

          <p className={styles.alreadyHaveAccount}>
            Вже маєте аккаунт? <Link href={'/signin'}>Ввійти</Link>
          </p>

          <div className={styles.signupSection}>
            <div className={styles.signupSection__headerContainer}>
              <p className={styles.successMessage}>{success}</p>

              <h2 className={styles.signupSection__header}>
                Реєстрація просто зараз
              </h2>
            </div>

            <form
              noValidate
              onSubmit={handleSubmit}
              className={`${styles.register_form} ${styles.form}`}
            >
              <div className={styles.form__section}>
                {renderFormErrors()}
                {renderErrors('username')}
                <input
                  type="text"
                  className={styles.form__input}
                  placeholder="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.form__section}>
                {renderErrors('email')}
                <input
                  className={styles.form__input}
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.form__section}>
                {renderErrors('password')}
                <input
                  className={styles.form__input}
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.form__section}>
                {renderErrors('reenterPassword')}
                <input
                  className={styles.form__input}
                  type="password"
                  placeholder="Reenter Password"
                  name="reenterPassword"
                  value={formData.reenterPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                onSubmit={handleSubmit}
                className={styles.form__btnSubmit}
              >
                Зареєструватися
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
