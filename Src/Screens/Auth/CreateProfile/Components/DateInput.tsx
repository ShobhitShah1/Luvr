import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  TextInputProps,
} from 'react-native';

interface DateInputProps extends TextInputProps {
  mask: string;
  validate?: boolean;
  activeColor?: string;
  onChange: (date: string) => void;
}

const DateInput: React.FC<DateInputProps> = ({
  mask = 'MM/DD/YYYY',
  validate = true,
  activeColor = '#7368FF',
  onChange,
  ...textInputProps
}) => {
  const inputRef = useRef<TextInput>(null);

  const [date, setDate] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleTextChange = (newText: string) => {
    const maskFields = mask.split('').filter((v) => ['M', 'D', 'Y'].includes(v));

    const formattedDate = maskFields.reduce((acc, field, index) => {
      acc += newText[index] || field;
      return acc;
    }, '');

    setDate(formattedDate);

    if (validate && newText.length > date.length) {
      // Validation logic goes here if needed
    }

    if (formattedDate.length === mask.length) {
      const [M, D, Y] = maskFields.map((field) => {
        const startIndex = mask.indexOf(field);
        const endIndex = startIndex + field.length;
        return formattedDate.substring(startIndex, endIndex);
      });

      const finalDate = new Date(`${M}-${D}-${Y}`);
      onChange(finalDate.toString() === 'Invalid Date' ? formattedDate : finalDate);
    }
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TextInput
        editable={true}
        keyboardType="number-pad"
        style={{
          position: 'absolute',
          maxHeight: 0,
          maxWidth: 0,
          backgroundColor: 'transparent',
          color: 'transparent',
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        maxLength={mask.length}
        ref={inputRef}
        value={date}
        onChangeText={handleTextChange}
        {...textInputProps}
      />
      {mask.split('').map((v, key) => (
        <TouchableWithoutFeedback key={key} onPress={() => inputRef.current?.focus()}>
          <View style={{ paddingHorizontal: 6 }}>
            {['M', 'D', 'Y'].includes(v) ? (
              <View pointerEvents="none">
                <TextInput
                  placeholder={v}
                  placeholderTextColor="#aaa"
                  value={date[mask.indexOf(v)]}
                  style={{
                    padding: 2,
                    textAlign: 'center',
                    fontSize: 20,
                    borderBottomWidth: 2,
                    borderBottomColor:
                      isFocused && date.length === mask.indexOf(v) ? activeColor : '#aaa',
                    color: '#5d5d5d',
                  }}
                />
              </View>
            ) : (
              <Text style={{ fontSize: 20, color: '#aaa' }}>{v}</Text>
            )}
          </View>
        </TouchableWithoutFeedback>   
      ))}
    </View>
  );
};

export default DateInput;