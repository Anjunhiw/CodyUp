// components/PriceSlider.jsx
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';

function PriceSlider({ range, onChange, max = 100000 }) {
  const handleChange = (event, newValue) => {
    onChange(newValue);
  };

  return (
    <Box sx={{ px:'2', width: '16vw' }}>
      <Slider
        value={range}
        onChange={handleChange}
        valueLabelDisplay="auto"
        min={0}
        max={100000}
        step={1000}
        sx={{
          color: 'rgb(36, 34, 34)', // 슬라이더 색상
          height: 6,         // 슬라이더 높이
          '& .MuiSlider-thumb': {
            width: 12,
            height: 12,
            backgroundColor: 'rgb(73, 70, 70)',
            border: '2px solid currentColor',
            
                boxShadow:'rgb(34, 33, 33)','&:hover, &.Mui-focusVisible': {
                boxShadow: '0 0 0 8px rgba(255, 255, 255, 0.2)',
            },

            
          },
          '& .MuiSlider-rail': {
            opacity: 0.28,
            backgroundColor:'rgb(128, 118, 118)',
          },
          '& .MuiSlider-track': {
            backgroundColor: 'rgb(255, 255, 255)',
          },
        }}
      />
    </Box>
  );
}

export default PriceSlider;
