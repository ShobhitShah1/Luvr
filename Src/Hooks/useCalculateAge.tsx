import { useState, useEffect } from 'react';

/**
 * A React hook that calculates age precisely based on birthdate
 * @param birthDate - Date string in format 'MM/DD/YYYY'
 * @returns The calculated age as a number, or null if birthDate is invalid
 */
const useCalculateAge = (birthDate: string) => {
  const [age, setAge] = useState<number | null>(null);

  useEffect(() => {
    calculateAge();
  }, [birthDate]);

  const calculateAge = () => {
    if (!birthDate) {
      setAge(null);

      return;
    }

    try {
      const [month, day, year] = birthDate.split('/');

      if (
        !month ||
        !day ||
        !year ||
        isNaN(Number(month)) ||
        isNaN(Number(day)) ||
        isNaN(Number(year))
      ) {
        setAge(null);

        return;
      }

      const birthDateObject = new Date(Number(year), Number(month) - 1, Number(day));

      if (isNaN(birthDateObject.getTime())) {
        setAge(null);

        return;
      }

      const today = new Date();

      let calculatedAge = today.getFullYear() - birthDateObject.getFullYear();

      if (
        today.getMonth() < birthDateObject.getMonth() ||
        (today.getMonth() === birthDateObject.getMonth() &&
          today.getDate() < birthDateObject.getDate())
      ) {
        calculatedAge--;
      }

      setAge(calculatedAge);
    } catch (error) {
      setAge(null);
    }
  };

  return age;
};

export default useCalculateAge;
