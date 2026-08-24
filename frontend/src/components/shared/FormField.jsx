import FieldTooltip from "./FieldTooltip";

// ====================================
// SHARED FORM FIELD COMPONENTS
// Replaces the near-identical local FieldInput/FieldSelect copies
// duplicated across Customer Request and Sales Survey's section
// files. Default border is neutral (set in SalesSurvey.css); the
// "error" prop switches it to orange via the "field-error" class.
// ====================================

// A "*" marks a compulsory field - styled orange on its own (not the
// whole label) so required fields are identifiable at a glance without
// the label text itself changing color. Two conventions coexist in
// this codebase (Sales Survey labels it trailing - "Survey Date*";
// Customer Request labels it leading - "*Company Name") - both are
// handled here rather than picking one and leaving the other unstyled.
function renderLabel(label){

    if(typeof label !== "string"){
        return label;
    }

    const trimmed = label.trim();

    if(trimmed.endsWith("*")){

        return(
            <>
                {label.slice(0, label.lastIndexOf("*"))}
                <span className="required-asterisk">*</span>
            </>
        );

    }

    if(trimmed.startsWith("*")){

        return(
            <>
                <span className="required-asterisk">*</span>
                {label.slice(label.indexOf("*") + 1)}
            </>
        );

    }

    return label;

}


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
    placeholder,
    tooltip

}) {

    return (

        <div className={error ? "survey-field field-error" : "survey-field"}>

            <label>
                {renderLabel(label)}
                <FieldTooltip text={tooltip}/>
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
    disabled,
    formatOption,
    tooltip

}) {

    return (

        <div className={error ? "survey-field field-error" : "survey-field"}>

            <label>
                {renderLabel(label)}
                <FieldTooltip text={tooltip}/>
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
                                {formatOption ? formatOption(item) : item}
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
