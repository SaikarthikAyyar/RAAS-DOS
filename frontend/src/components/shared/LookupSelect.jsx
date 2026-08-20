import { useEffect, useState } from "react";

import { FieldInput, FieldSelect } from "./FormField";

import { useLookupLists } from "../../context/LookupListsContext";


// ====================================
// LOOKUP SELECT
// Drop-in replacement for a static-array FieldSelect: options come
// from the DB-backed Lookup Lists system instead of a static array.
// If the list's flagged "Other" row is selected, the control swaps in
// place to a free-text input bound to the SAME section/field - no new
// field key, no backend change, since every backing column is already
// a plain unconstrained string. See Phase 11 in the cumulative plan
// file for the full design rationale.
// ====================================

export default function LookupSelect({

    listKey,
    conditionalTag,
    label,
    value,
    section,
    field,
    updateSection,
    readOnly,
    disabled,
    error,
    errorMessage,
    onBlur,
    formatOption

}){

    const { getOptions, getOtherValue, loading } = useLookupLists();

    const options = getOptions(listKey, { conditionalTag });

    const otherRow = getOtherValue(listKey);

    const [showOtherInput, setShowOtherInput] = useState(false);

    const [initialized, setInitialized] = useState(false);

    // Resolve the starting mode once the list has actually loaded -
    // if it ran before options arrived, an existing free-typed value
    // would look "unknown" simply because the list was still empty.
    useEffect(()=>{

        if(!loading && !initialized){

            const isKnownOrEmpty = !value || options.includes(value);

            setShowOtherInput(!isKnownOrEmpty);

            setInitialized(true);

        }

    }, [loading, initialized, options, value]);

    function handleSelectChange(sec, fld, newValue){

        if(otherRow && newValue === otherRow.value){

            setShowOtherInput(true);

            updateSection(sec, fld, "");

        }

        else{

            updateSection(sec, fld, newValue);

        }

    }

    function handleChooseFromList(){

        setShowOtherInput(false);

        updateSection(section, field, "");

    }

    if(showOtherInput){

        return(

            <div className="lookup-select-other-wrap">

                <FieldInput

                    label={label}
                    value={value}
                    section={section}
                    field={field}
                    updateSection={updateSection}
                    readOnly={readOnly}
                    disabled={disabled}
                    error={error}
                    errorMessage={errorMessage}
                    onBlur={onBlur}
                    placeholder="Type your own value"

                />

                {

                    !readOnly && !disabled && (

                        <button

                            type="button"

                            className="lookup-select-back-link"

                            onClick={handleChooseFromList}

                        >

                            ↩ choose from list

                        </button>

                    )

                }

            </div>

        );

    }

    return(

        <FieldSelect

            label={label}
            value={value}
            section={section}
            field={field}
            options={options}
            updateSection={handleSelectChange}
            disabled={disabled || loading}
            error={error}
            errorMessage={errorMessage}
            onBlur={onBlur}
            formatOption={formatOption}

        />

    );

}
