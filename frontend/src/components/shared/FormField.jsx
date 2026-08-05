// ====================================
// SHARED FORM FIELD COMPONENTS
// Replaces the near-identical local FieldInput/FieldSelect copies
// duplicated across Customer Request and Sales Survey's section
// files. Default border is neutral (set in SalesSurvey.css); the
// "error" prop switches it to orange via the "field-error" class.
// ====================================

export function FieldInput({

    label,
    value,
    type,
    section,
    field,
    updateSection,
    onBlur,
    error,
    errorMessage,
    readOnly,
    disabled,
    list,
    placeholder

}) {

    return (

        <div className={error ? "survey-field field-error" : "survey-field"}>

            <label>
                {label}
            </label>

            <input
                type={type || "text"}
                value={value || ""}
                list={list}
                placeholder={placeholder}
                readOnly={readOnly}
                disabled={disabled}
                onChange={(e) =>
                    updateSection(
                        section,
                        field,
                        e.target.value
                    )
                }
                onBlur={onBlur}
            />

            {
                error && errorMessage && (
                    <span className="field-error-message">
                        {errorMessage}
                    </span>
                )
            }

        </div>

    );

}


export function FieldSelect({

    label,
    value,
    section,
    field,
    options,
    updateSection,
    onBlur,
    error,
    errorMessage,
    disabled

}) {

    return (

        <div className={error ? "survey-field field-error" : "survey-field"}>

            <label>
                {label}
            </label>

            <select
                value={value || ""}
                disabled={disabled}
                onChange={(e) =>
                    updateSection(
                        section,
                        field,
                        e.target.value
                    )
                }
                onBlur={onBlur}
            >

                <option value="">
                    Select
                </option>

                {
                    options.map(
                        item => (
                            <option
                                key={item}
                                value={item}
                            >
                                {item}
                            </option>
                        )
                    )
                }

            </select>

            {
                error && errorMessage && (
                    <span className="field-error-message">
                        {errorMessage}
                    </span>
                )
            }

        </div>

    );

}
