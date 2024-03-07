import {useState, useEffect} from 'react';

const useCalculateAge = (birthDate: string) => {
  const [age, setAge] = useState<number | null>(null);

  useEffect(() => {
    const calculateAge = () => {
      if (birthDate) {
        const today = new Date();
        const [month, day, year] = birthDate?.split('/');
        const birthDateObject = new Date(`${year}-${month}-${day}`);
        let calculatedAge = today.getFullYear() - birthDateObject.getFullYear();

        if (
          today.getMonth() < birthDateObject.getMonth() ||
          (today.getMonth() === birthDateObject.getMonth() &&
            today.getDate() < birthDateObject.getDate())
        ) {
          calculatedAge--;
        }

        setAge(calculatedAge);
      } else {
        return null;
      }
    };

    calculateAge();

    return () => {};
  }, [birthDate]);

  return age;
};

export default useCalculateAge;
