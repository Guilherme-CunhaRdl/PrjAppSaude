import React, { useState } from 'react';
import axios from 'axios';

const APP_ID = "ff1cdbe4";
const APP_KEY = "055dbc209ae77820286afed6967d03d5";
const BASE_URL = "https://trackapi.nutritionix.com/v2";


export const useNutritionix = () =>{
    const [data,setData] =useState(null);
    const [loading, setLoading] = useState(false);
    const [error,setError] = useState(null)

    const fetchNutrients = async (query) =>{
        setLoading(true);
        try{
            const response = await axios.post(
                '${BASE_URL}/natural/nutrients',{ query },
                {
                    headers:{
                        "x-app-id": APP_ID,
                        "x-app-key": APP_KEY,
                        "Content-Type": "Application/json",
                    },
                }
            );
            setData(response.data);
        }catch(err){
            setError(err);
        }
        setLoading(false)
    };

    return{ data, loading, error, fetchNutrients };
}