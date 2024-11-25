import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const button = document.querySelector('button[data-start]');

button.disabled = true;
let userSelectedDate;
let interval;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] <= new Date()) {
      iziToast.warning({
        title: 'Caution',
        message: 'Please choose a date in the future',
      });
    } else {
      userSelectedDate = selectedDates[0];
      button.disabled = false;
    }
  },
};

flatpickr('#datetime-picker', options);

button.addEventListener('click', function () {
  if (userSelectedDate) {
    const timeDifference = userSelectedDate - new Date();
    const { days, hours, minutes, seconds } = convertMs(timeDifference);
    days, hours, minutes, seconds;
    button.disabled = true;

    interval = setInterval(() => {
      const { days, hours, minutes, seconds } = convertMs(
        userSelectedDate - new Date()
      );
      updateTimer(days, hours, minutes, seconds);
    }, 1000);
  }
});

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateTimer(days, hours, minutes, seconds) {
  document.querySelector('[data-days]').textContent = addLeadingZero(days);
  document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
  document.querySelector('[data-minutes]').textContent =
    addLeadingZero(minutes);
  document.querySelector('[data-seconds]').textContent =
    addLeadingZero(seconds);

  if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
    clearInterval(interval);
    iziToast.success({
      title: `Success`,
      message: `Timer has finished!`,
    });
  }
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
