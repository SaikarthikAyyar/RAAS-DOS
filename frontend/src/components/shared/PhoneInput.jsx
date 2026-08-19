import { COUNTRY_CODES, DEFAULT_COUNTRY_ISO2 } from "../../data/countryCodes";

// ====================================
// PHONE INPUT
// Country-code selector + a digits-only field that accepts exactly 10
// numbers - used everywhere a phone/contact number is collected.
// Stored/round-tripped as one combined string "+<dial code> <10
// digits>" (e.g. "+91 9876543210") so every backing column stays the
// plain VARCHAR it already is, no schema change needed. Same prop
// shape as FormField's FieldInput (label/value/section/field/
// updateSection/onBlur/error/errorMessage) so it drops in identically
// wherever a phone FieldInput used to be - callers that aren't
// updateSection-driven (plain useState forms) pass a small adapter
// closure, matching the precedent already used for LookupSelect in
// NewCustomerModal.jsx.
// ====================================

function parseValue(value){

    const match = /^(\+\d{1,4})\s?(\d*)$/.exec((value || "").trim());

    if(!match){
        return { dial: "", digits: "" };
    }

    return { dial: match[1], digits: match[2] };

}

function iso2ForDial(dial){

    const match = COUNTRY_CODES.find(c => c.dial === dial);

    return match ? match.iso2 : DEFAULT_COUNTRY_ISO2;

}

export default function PhoneInput({

    label,
    value,
    section,
    field,
    updateSection,
    onBlur,
    error,
    errorMessage,
    disabled

}){

    const defaultCountry = COUNTRY_CODES.find(c => c.iso2 === DEFAULT_COUNTRY_ISO2);

    const parsed = parseValue(value);

    const dial = parsed.dial && parsed.dial !== "+" ? parsed.dial : defaultCountry.dial;

    const digits = parsed.digits;

    const selectedIso2 = iso2ForDial(dial);

    function emit(nextDial, nextDigits){

        const combined = nextDigits ? `${nextDial} ${nextDigits}` : "";

        updateSection(section, field, combined);

    }

    function handleCountryChange(iso2){

        const country = COUNTRY_CODES.find(c => c.iso2 === iso2) || defaultCountry;

        emit(country.dial, digits);

    }

    function handleDigitsChange(raw){

        const cleaned = raw.replace(/\D/g, "").slice(0, 10);

        emit(dial, cleaned);

    }

    return(

        <div className={error ? "survey-field field-error" : "survey-field"}>

            <label>
                {label}
            </label>

            <div className="phone-input-row">

                <select
                    className="phone-input-country"
                    value={selectedIso2}
                    disabled={disabled}
                    onChange={e => handleCountryChange(e.target.value)}
                    onBlur={onBlur}
                >
                    {
                        COUNTRY_CODES.map(c => (
                            <option key={c.iso2} value={c.iso2}>
                                {c.dial} {c.name}
                            </option>
                        ))
                    }
                </select>

                <input
                    className="phone-input-digits"
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="10-digit number"
                    value={digits}
                    disabled={disabled}
                    onChange={e => handleDigitsChange(e.target.value)}
                    onBlur={onBlur}
                />

            </div>

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
