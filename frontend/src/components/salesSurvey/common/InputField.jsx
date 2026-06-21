// ====================================
// INPUT FIELD
// ====================================

export default function InputField({

    label,

    value,

    onChange,

    placeholder = ""

}) {

    return (

        <div className="survey-field">

            <label>

                {label}

            </label>

            <input

                value={value}

                placeholder={placeholder}

                onChange={onChange}

            />

        </div>

    );

}