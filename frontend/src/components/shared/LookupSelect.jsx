import { useEffect, useState, useRef } from "react";

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

    // Once the user (or the two handlers below, on their behalf)
    // explicitly picks a mode, the auto-resolve effect below must never
    // override it again - a ref, not state, since flipping it should
    // never itself trigger a render.
    const userTouchedRef = useRef(false);

    // Keeps re-resolving the starting mode (not just once) until the
    // user actually interacts - `value` often arrives from a SEPARATE
    // async fetch (e.g. loading a previously-saved survey) that can
    // settle after the lookup list's own `loading` has already gone
    // false. Resolving only once, keyed off `loading`, would freeze in
    // "known/empty" mode using the still-blank initial value and then
    // never re-check once the real (possibly free-typed) value shows up -
    // silently hiding a saved "Other" value on reload.
    useEffect(()=>{

        if(loading || userTouchedRef.current){
            return;
        }

        const isKnownOrEmpty = !value || options.includes(value);

        setShowOtherInput(!isKnownOrEmpty);

    }, [loading, options, value]);

    function handleSelectChange(sec, fld, newValue){

        userTouchedRef.current = true;

        if(otherRow && newValue === otherRow.value){

            setShowOtherInput(true);

            updateSection(sec, fld, "");

        }

        else{

            updateSection(sec, fld, newValue);

        }

    }

    function handleChooseFromList(){

        userTouchedRef.current = true;

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
