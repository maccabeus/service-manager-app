export const appointments = [
  {
    title: 'Repair this iphone',
    startDate: new Date(2021, 5, 27, 13, 35),
    endDate: new Date(2021, 5, 28, 11, 30),
    id: 0,
    location: 'Room 1',
  }, 
  {
    title: 'Book Flights to San Fran for Sales Trip',
    startDate: new Date(2018, 5, 25, 12, 11),
    endDate: new Date(2018, 5, 25, 13, 0),
    id: 1,
    location: 'Room 1',
  },
];

// import moment from 'moment';
// import { appointments } from './appointments';

// const currentDate = moment();
// let date = currentDate.date();

// const makeTodayAppointment = (startDate, endDate) => {
//   const days = moment(startDate).diff(endDate, 'days');
//   const nextStartDate = moment(startDate)
//     .year(currentDate.year())
//     .month(currentDate.month())
//     .date(date);
//   const nextEndDate = moment(endDate)
//     .year(currentDate.year())
//     .month(currentDate.month())
//     .date(date + days);

//   return {
//     startDate: nextStartDate.toDate(),
//     endDate: nextEndDate.toDate(),
//   };
// };

// export default appointments.map(({ startDate, endDate, ...restArgs }) => {
//   const result = {
//     ...makeTodayAppointment(startDate, endDate),
//     ...restArgs,
//   };
//   date += 1;
//   if (date > 31) date = 1;
//   return result;
// });
