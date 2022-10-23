import { Autocomplete, Box, TextField } from '@mui/material';
import React from 'react';
function AutoCompleteSelect({textLabel,options,selectedOption,onChange,labelOption,labelImage}) {
    return (
        <Autocomplete
                value={selectedOption||null}
                options={options}
                onChange={(e,newVal)=>onChange(newVal)}
                autoHighlight
                fullWidth
                getOptionLabel={(option) => option[labelOption]}
                renderOption={(props, option) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    {labelImage&&<img width="20" src={option[labelImage]}/>}
                    {option[labelOption]}
                </Box>
                )}
                renderInput={(params) => (
                <TextField
                    {...params}
                    label={textLabel}
                    inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password', 
                    }}
                />
                )}
            />
    );
}

export default AutoCompleteSelect;