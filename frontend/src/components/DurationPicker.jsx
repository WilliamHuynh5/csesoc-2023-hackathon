import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';

export default function BasicDateRangeField() {
  
  const [startDate, setStartDate] = useState(Date); 
  const [endDate, setEndDate] = useState(Date);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={['MultiInputDateRangeField', 'SingleInputDateRangeField']}
      >
        <MultiInputDateRangeField
          slotProps={{
            textField: ({ position }) => ({
              label: position === 'start' ? 'Departure' : 'Return',
            }),
          }}
          onChange={(event) => setStartDate(event.target.value)}
        />
      
      </DemoContainer>
    </LocalizationProvider>
  );
}