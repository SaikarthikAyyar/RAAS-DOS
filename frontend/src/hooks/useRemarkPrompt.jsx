import { useState, useCallback, useRef } from "react";

import RemarkPromptModal from "../components/shared/RemarkPromptModal";


// ====================================
// HOOK
// promptForRemark(actionLabel) opens the shared remark modal and
// resolves with the typed remark string on Confirm, or null on
// Cancel. Callers await it, bail out on null, otherwise include the
// remark (plus actor) in the mutation payload. Render {remarkModal}
// once per component that calls promptForRemark.
// ====================================

export function useRemarkPrompt(){

    const [actionLabel, setActionLabel] = useState(null);

    const resolverRef = useRef(null);

    const promptForRemark = useCallback((label) => {

        setActionLabel(label);

        return new Promise((resolve) => {
            resolverRef.current = resolve;
        });

    }, []);

    function handleConfirm(remark){

        setActionLabel(null);

        if(resolverRef.current){
            resolverRef.current(remark);
            resolverRef.current = null;
        }

    }

    function handleCancel(){

        setActionLabel(null);

        if(resolverRef.current){
            resolverRef.current(null);
            resolverRef.current = null;
        }

    }

    const remarkModal = actionLabel ? (

        <RemarkPromptModal
            actionLabel={actionLabel}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
        />

    ) : null;

    return { promptForRemark, remarkModal };

}
