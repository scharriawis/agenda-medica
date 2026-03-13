import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

export type SlotStatus = 'available' | 'booked' | 'disabled'

export interface AgendaSlot {
    hora: string
    status: SlotStatus
}

export function useAgendaSlots(
    professionalId: number | null,
    fecha: string | null
) {

    const [slots,setSlots] = useState<AgendaSlot[]>([])
    const [loading,setLoading] = useState(false)

    const loadSlots = useCallback(async () => {

        if(!professionalId || !fecha) return

        setLoading(true)

        try{

            const {data} = await axios.get('/api/agenda/slots',{
                params:{
                    professional_id: professionalId,
                    fecha
                }
            })

            setSlots(data)

        }catch(error){
            console.error(error)
        }

        setLoading(false)

    },[professionalId,fecha])



    useEffect(()=>{

        loadSlots()

    },[loadSlots])


    return {
        slots,
        loading,
        reload: loadSlots
    }
}