const storageKey = "raas_jobs"

export const getJobs = () => {

    return JSON.parse(

        localStorage.getItem(storageKey)

    ) || []

}


export const saveJobs = (jobs) => {

    localStorage.setItem(

        storageKey,

        JSON.stringify(jobs)

    )

}


export const createJob = (job) => {

    const jobs = getJobs()

    jobs.push(job)

    saveJobs(jobs)

}


export const updateJob = (id,data) => {

    const jobs = getJobs()

    const updated = jobs.map(

        item =>

            item.id === id

            ?

            {...item,...data}

            :

            item

    )

    saveJobs(updated)

}