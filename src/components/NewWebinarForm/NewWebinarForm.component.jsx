'use client';

import { useState } from 'react';

import styles from './NewWebinarForm.module.css';

export default function NewWebinarForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    duration: '',
    price: '',
    agenda: [],
    speakers: [],
    testimonials: [],
  });
  let [agendaValue, setAgendaValue] = useState('');
  let [speakerNameValue, setSpeakerNameValue] = useState('');
  let [speakerRegaliaValue, setSpeakerRegaliaValue] = useState('');
  let [errors, setErrors] = useState({
    title: [],
    description: [],
    date: [],
    duration: [],
    price: [],
    addAgendaItem: [],
    agenda: [],
    speakerName: [],
    speakerRegalia: [],
    speakers: [],
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAgendaChange = (event) => {
    setAgendaValue(event.target.value);
  };

  const addAgendaItem = () => {
    const validationResult = validateAddAgendaItem(
      agendaValue,
      errors.addAgendaItem
    );
    if (validationResult) {
      setFormData((prev) => ({
        ...prev,
        agenda: [...prev.agenda, agendaValue],
      }));
      setAgendaValue('');
    } else {
      return;
    }
  };

  const handleSpeakerNameChange = (event) => {
    setSpeakerNameValue(event.target.value);
  };

  const handleSpeakerRegaliaChange = (event) => {
    setSpeakerRegaliaValue(event.target.value);
  };

  const addSpeakerItem = () => {
    const validationResult = validateAddSpeakerItem(
      { speakerNameValue, speakerRegaliaValue },
      errors.speakerName,
      errors.speakerRegalia
    );
    if (validationResult) {
      setFormData((prev) => ({
        ...prev,
        speakers: [
          ...prev.speakers,
          { name: speakerNameValue, regalia: speakerRegaliaValue },
        ],
      }));
      setSpeakerNameValue('');
      setSpeakerRegaliaValue('');
    } else {
      return;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm() > 0) {
      return;
    }

    const res = await fetch('/api/webinars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        duration: Number(formData.duration),
        price: Number(formData.price),
        date: new Date(formData.date),
      }),
    });

    if (res.ok) {
      alert('Webinar created!');
    } else {
      alert('Error creating webinar!');
    }
  };

  const validateForm = () => {
    let totalErrorsAmount = 0;
    const newErrors = {
      title: [],
      description: [],
      date: [],
      duration: [],
      price: [],
      addAgendaItem: [],
      agenda: [],
      speakerName: [],
      speakerRegalia: [],
      speakers: [],
    };

    validateTitle(formData.title, newErrors.title);
    validateDescription(formData.description, newErrors.description);
    validateDate(formData.date, newErrors.date);
    validateDuration(formData.duration, newErrors.duration);
    validatePrice(formData.price, newErrors.price);
    validateAgenda(formData.agenda, newErrors.agenda);
    validateSpeakers(formData.speakers, newErrors.speakers);

    for (const key in newErrors) {
      if (Array.isArray(newErrors[key])) {
        newErrors[key].forEach((item) => {
          if (item) totalErrorsAmount++;
        });
      }
    }

    setErrors({ ...newErrors });

    return totalErrorsAmount;
  };

  const validateTitle = (title, errorsArray) => {
    if (title.trim().length === 0)
      errorsArray.push('Вебинар должен иметь заглавие!');
    if (title.length > 30)
      errorsArray.push(
        'Максимальное количество символов в заглавии вебинара - 30!'
      );
    if (title.length < 6) {
      errorsArray.push(
        'Минимальное количество сиволов в заглавии вебинара - 6!'
      );
    }
  };

  const validateDescription = (description, errorsArray) => {
    if (description.trim().length === 0)
      errorsArray.push('Вебинар должен иметь описание!');
    if (description.length > 150)
      errorsArray.push(
        'Максимальное количество символов в описании вебинара - 150!'
      );
    if (description.length < 6) {
      errorsArray.push(
        'Минимальное количество символов в описании вебинара - 6!'
      );
    }
  };

  const validateDate = (date, errorsArray) => {
    const todayDate = new Date().setHours(0, 0, 0, 0);
    if (!date) {
      errorsArray.push('Вы должны указать дату вебинара!');
    }
    if (date && new Date(date).getTime() < new Date(todayDate).getTime()) {
      errorsArray.push('Указанная вами дата не может быть в прошлом!');
    }
  };

  const validateDuration = (duration, errorsArray) => {
    if (!duration) {
      errorsArray.push('Вы должны указать длительность вебинара!');
    }
    if (duration < 0) {
      errorsArray.push(
        'Значение длительности вебинара не может быть отрицательным!'
      );
    }
    if (duration > 300) {
      errorsArray.push(
        'Значение длительности вебинара не может превышать 300 минут(5 часов)!'
      );
    }
  };

  const validatePrice = (price, errorsArray) => {
    if (!price) {
      errorsArray.push('Вы должны указать цену вебинара!');
    }
    if (price < 0) {
      errorsArray.push('Значение цены вебинара не может быть отрицательным!');
    }
    if (price > 15000) {
      errorsArray.push('Значение цены вебинара не может превышать 15 000!');
    }
  };

  const validateAddAgendaItem = (agendaValue, errorsArray) => {
    if (!agendaValue && !errorsArray.includes('Поле не должно быть пустым!')) {
      errorsArray.push('Поле не должно быть пустым!');
      setFormData((prev) => ({ ...prev }));
    }

    if (
      agendaValue < 6 &&
      !errorsArray.includes(
        'Минимальное количество символов в элементе списка событий - 6!'
      )
    ) {
      errorsArray.push(
        'Минимальное количество символов в элементе списка событий - 6!'
      );
      setFormData((prev) => ({ ...prev }));
    }

    if (errorsArray.length === 0) {
      setErrors((prev) => ({ ...prev, addAgendaItem: [] }));
    }

    return errorsArray.length === 0 ? true : false;
  };

  const validateAgenda = (agendaArray, errorsArray) => {
    if (!agendaArray || agendaArray.length === 0) {
      errorsArray.push(
        'В списке событий должен быть по крайней мере 1 элемент!'
      );
    }
  };

  const validateAddSpeakerItem = (
    speakerValue,
    nameErrorsArray,
    regaliaErrorsArray
  ) => {
    let totalErrorsAmount = 0;
    const { speakerNameValue, speakerRegaliaValue } = speakerValue;

    nameErrorsArray = [];
    regaliaErrorsArray = [];

    setErrors((prev) => ({
      ...prev,
      speakerName: nameErrorsArray,
      speakerRegalia: regaliaErrorsArray,
    }));

    if (
      !speakerNameValue &&
      !nameErrorsArray.includes('Поле имени спикера должно быть заполнено!')
    ) {
      nameErrorsArray.push('Поле имени спикера должно быть заполнено!');
      totalErrorsAmount++;
      setFormData((prev) => ({ ...prev }));
    }
    if (
      speakerNameValue.length < 3 &&
      !nameErrorsArray.includes(
        'Минимальное количество символов имени спикера - 3!'
      )
    ) {
      nameErrorsArray.push(
        'Минимальное количество символов имени спикера - 3!'
      );
      totalErrorsAmount++;
      setFormData((prev) => ({ ...prev }));
    }

    if (
      !speakerRegaliaValue &&
      !regaliaErrorsArray.includes(
        'Поле регалий спикера должно быть заполненым!'
      )
    ) {
      regaliaErrorsArray.push('Поле регалий спикера должно быть заполненым!');
      totalErrorsAmount++;
      setFormData((prev) => ({ ...prev }));
    }
    if (
      speakerRegaliaValue.length < 6 &&
      !regaliaErrorsArray.includes(
        'Минимальное количество символов для поля регалий спикера - 6'
      )
    ) {
      regaliaErrorsArray.push(
        'Минимальное количество символов для поля регалий спикера - 6'
      );
      totalErrorsAmount++;
      setFormData((prev) => ({ ...prev }));
    }

    return totalErrorsAmount === 0 ? true : false;
  };

  const validateSpeakers = (speakersArray, errorsArray) => {
    if (!speakersArray || speakersArray.length === 0) {
      errorsArray.push('Вебинар должен иметь по крайней мере 1 спикера!');
    }
  };

  const renderErrors = (errorsObject) => {
    if (errorsObject.length === 0) return;

    return (
      <div className={styles.form__errorsContainer}>
        {errorsObject.map((error, index) => (
          <p className={styles.error} key={index}>
            * {error}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.newWebinarForm}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.form__container}>
          {renderErrors(errors.title)}
          <input
            className={styles.form__input}
            name="title"
            placeholder="Title"
            onChange={handleChange}
            value={formData.title}
          />
        </div>

        <div className={styles.form__container}>
          {renderErrors(errors.description)}
          <textarea
            className={styles.form__textarea}
            name="description"
            placeholder="Description"
            onChange={handleChange}
            value={formData.description}
          />
        </div>

        <div className={styles.form__container}>
          {renderErrors(errors.date)}
          <input
            className={styles.form__dateInput}
            type="date"
            name="date"
            onChange={handleChange}
            value={formData.date}
          />
        </div>

        <div className={styles.form__container}>
          {renderErrors(errors.duration)}
          <input
            className={styles.form__input}
            type="number"
            name="duration"
            placeholder="Duration in minutes"
            onChange={handleChange}
            value={formData.duration}
          />
        </div>

        <div className={styles.form__container}>
          {renderErrors(errors.price)}
          <input
            className={styles.form__input}
            type="number"
            name="price"
            placeholder="Price"
            onChange={handleChange}
            value={formData.price}
          />
        </div>

        <div className={styles.form__agendaContainer}>
          {renderErrors(errors.agenda)}
          <div className={`${styles.form__section} ${styles.section}`}>
            <label className={styles.section__label}>Agenda</label>
            <div className={styles.section__inputContainer}>
              <div className={styles.form__container}>
                {renderErrors(errors.addAgendaItem)}
                <input
                  className={styles.section__input}
                  type="text"
                  placeholder="Agenda"
                  value={agendaValue}
                  onChange={handleAgendaChange}
                />
              </div>
              <button
                className={styles.section__addButton}
                onClick={addAgendaItem}
                type="button"
              >
                + Add Agenda item
              </button>
            </div>
            <ul className={styles.section__agendaList}>
              {formData.agenda.map((item, index) => (
                <li key={index} className={styles.section__agendaItem}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.form__speakersContainer}>
          {renderErrors(errors.speakers)}
          <div className={`${styles.form__section} ${styles.section}`}>
            <label className={styles.section__label}>Speakers</label>
            <div className={styles.section__inputContainer}>
              <div className={styles.form__container}>
                {renderErrors(errors.speakerName)}
                <input
                  className={styles.section__input}
                  name="speakerName"
                  placeholder="Name"
                  value={speakerNameValue}
                  onChange={handleSpeakerNameChange}
                />
              </div>
              <div className={styles.form__container}>
                {renderErrors(errors.speakerRegalia)}
                <textarea
                  className={styles.section__textarea}
                  name="speakerRegalia"
                  placeholder="Regalia"
                  value={speakerRegaliaValue}
                  onChange={handleSpeakerRegaliaChange}
                />
              </div>
              <button
                className={styles.section__addButton}
                type="button"
                onClick={addSpeakerItem}
              >
                + Add Speaker
              </button>
            </div>
            <ul className={styles.section__speakersList}>
              {formData.speakers.map((item, index) => (
                <li
                  key={index}
                  className={`${styles.section__speakerItem} ${styles.speaker}`}
                >
                  <div className={styles.speaker__name}>{item.name}</div>
                  <div className={styles.speaker__regalia}>{item.regalia}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button className={styles.form__buttonSubmit} type="submit">
          Create/Add Webinar
        </button>
      </form>
    </div>
  );
}
