import React from 'react'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';

const LimitedMultiSelect = (props) => {
    const filterOptions = createFilterOptions({
        matchFrom: 'start',
        // limit: 500,
    });  
    
    const options = props.options ? props.options : []
    const selectedOptions = props.selectedOptions ? props.selectedOptions : []
    const setSelectedOptions = props.setSelectedOptions
    const maxSelections = props.maxSelections ? props.maxSelections : 100
    const errorText = props.errorText
    const setErrorText = props.setErrorText
    const loading = props.loading
    const label = props.label
    const size = props.size ? props.size : '';
    const onChange = props.onChange;
  
    return (
        <Autocomplete 
            filterOptions={filterOptions}
            options={options}
            value={selectedOptions}
            getOptionDisabled={(option) => (selectedOptions.length === maxSelections || selectedOptions.includes(option) ? true : false)}
            id="limited-select"
            loading={loading}
            size={size}
            onChange={(e, value) => {
                if (value) setErrorText('');
                setSelectedOptions(value);
                if (onChange) onChange(value);
            }}
            autoHighlight={true}
            multiple
            renderInput={(params) =>
                <TextField {...params} label={label} variant="outlined"
                    error={errorText ? true : false}
                    helperText={selectedOptions.length === maxSelections && errorText === "" ? "Maximum number of selections have been made." : errorText}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>),
                    }}
                />
            }
        />
    )
}

export default LimitedMultiSelect