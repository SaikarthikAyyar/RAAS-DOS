import { createContext, useCallback, useContext, useEffect, useState } from "react";

import {
    getLookupLists,
    getLookupList
} from "../services/lookupListsService";


// ====================================
// CONTEXT
// One GET /lookup-lists fetch per app load, shared by every dropdown
// across Business Masters, Customer Request, and Sales Survey - avoids
// each of the ~89 migrated fields making its own network request.
// ====================================

const LookupListsContext = createContext(null);


export function LookupListsProvider({ children }){

    const [lists, setLists] = useState({});

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const load = useCallback(async()=>{

        setLoading(true);

        setError("");

        try{

            const data = await getLookupLists();

            const byKey = {};

            data.forEach(list=>{ byKey[list.list_key] = list; });

            setLists(byKey);

        }

        catch(err){

            console.error(err);

            setError("Unable to load lookup lists.");

        }

        finally{

            setLoading(false);

        }

    }, []);

    useEffect(()=>{ load(); }, [load]);

    async function refetchList(listKey){

        try{

            const data = await getLookupList(listKey);

            setLists(prev=>({ ...prev, [listKey]: data }));

        }

        catch(err){

            console.error(err);

        }

    }

    function getOptions(listKey, { conditionalTag } = {}){

        const list = lists[listKey];

        if(!list) return [];

        return list.values

            .filter(v=>!v.conditional_tag || v.conditional_tag===conditionalTag)

            .map(v=>v.value);

    }

    function getOtherValue(listKey){

        const list = lists[listKey];

        if(!list) return null;

        return list.values.find(v=>v.is_other) || null;

    }

    const value = {

        lists,
        loading,
        error,
        getOptions,
        getOtherValue,
        refetchList,
        refetchAll: load

    };

    return(

        <LookupListsContext.Provider value={value}>

            {children}

        </LookupListsContext.Provider>

    );

}


export function useLookupLists(){

    const context = useContext(LookupListsContext);

    if(!context){

        throw new Error("useLookupLists must be used within a LookupListsProvider");

    }

    return context;

}
