import styles from './Spinner.module.css';

export default function Spinner() {
  return (
    <div className={styles.spinnerContainier}>
      <div className={styles.spinner}></div>
    </div>
  );
}
