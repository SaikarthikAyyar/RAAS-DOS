// ====================================
// SELECT FIELD
// ====================================

export default function SelectField({

    label,

    value,

    options,

    onChange

}) {

    return (

        <div className="survey-field">

            <label>

                {label}

            </label>

            <select

                value={value}

                onChange={onChange}

            >

                <option value="">

                    Select

                </option>

                {

                    options.map(item=>(

                        <option

                            key={item}

                            value={item}

                        >

                            {item}

                        </option>

                    ))

                }

            </select>

        </div>

    );

}