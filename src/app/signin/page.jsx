'use client';

import styles from './page.module.css';

import Link from 'next/link';
import { useState } from 'react';

import Logo from '@/components/icons/logo/logo.component';

export default function SigninPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: [],
    password: [],
  });

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

  const checkForErrorsAmount = (errorsObject) => {
    let errorsAmount = 0;
    for (const key in errorsObject) {
      if (Array.isArray(errorsObject[key])) {
        errorsAmount += errorsObject[key].length;
      } else if (isPrimitive(errorsObject[key])) {
        if (errorsObject[key] !== null && errorsObject[key !== undefined]) {
          errorsAmount++;
        }
      }
    }
    return errorsAmount;
  };

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateEmail = (emailValue, emailErrorsArr) => {
    if (!isValidEmail(emailValue.trim())) {
      emailErrorsArr.push('Email введений не корректно.');
    }
  };

  const validatePassword = (passwordValue, passwordErrorsArr) => {
    if (passwordValue < 6)
      passwordErrorsArr.push('Мінімальна довжина паролю - 6 символів.');
  };

  const validateForm = (errorsObject) => {
    validateEmail(formData.email, errorsObject.email);
    validatePassword(formData.password, errorsObject.password);

    const errorsAmount = checkForErrorsAmount(errorsObject);
    return {
      errorsObject: errorsObject,
      errorsAmount: errorsAmount,
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {
      email: [],
      password: [],
    };
    setErrors(newErrors);

    const { errorsObject, errorsAmount } = validateForm(newErrors);
    setErrors({ ...errorsObject });
    if (errorsAmount !== 0) {
      return;
    }

    try {
      const res = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
    } catch (error) {}
  };

  const renderErrors = (errors) => {
    return (
      <ul className={styles.errorsList}>
        {errors.map((error, index) => {
          return (
            <li key={index} className={styles.errorsList__item}>
              {error}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className={styles.signin}>
      <div className={styles.signin__container}>
        <div className={`${styles.signin__left} ${styles.left}`}>
          <div className={styles.left__content}>
            <Link href={'/'}>
              <Logo />
            </Link>
            <p className={styles.left__text}>Ввійди і навчайся просто зараз</p>
          </div>
        </div>

        <div className={`${styles.signin__right} ${styles.right}`}>
          <p className={styles.notHaveAccount}>
            Ще не маєте акаунту? <Link href={'/register'}>Зареєструватися</Link>
          </p>

          <div className={styles.signinSection}>
            <h2 className={styles.signinSection__header}>Ввійти</h2>

            <form
              className={`${styles.right__form} ${styles.form}`}
              noValidate
              onSubmit={handleSubmit}
            >
              <div className={styles.form__inputSection}>
                {renderErrors(errors.email)}
                <input
                  className={styles.form__input}
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.form__inputSection}>
                {renderErrors(errors.password)}
                <input
                  className={styles.form__input}
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <Link className={styles.forgotPassword} href={'forgot-password'}>
                Forgot password?
              </Link>
              <button
                className={styles.form__submitButton}
                onSubmit={handleSubmit}
              >
                Ввійти
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
