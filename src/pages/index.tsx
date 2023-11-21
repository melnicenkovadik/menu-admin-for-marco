import HomaPageContainer from "../containers/home-page";
import {useRecoilState} from "recoil";
import {categoriesState} from "../store/atoms/categories";
import axios from "axios";
import {useEffect, useState} from "react";

export default function Home() {
    const [loading,setLoading]=useState(true)

    const [, setCategories] = useRecoilState(categoriesState);
    const fetchCategories = async () => {
        try {
            const res = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/api/categories");

            setCategories(res?.data?.data || []);

        } catch (e) {
            console.log(e);
            setCategories([]);
        }
        setLoading(false)
    };
    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <>
            {loading && <div className="loading">Loading&#8230;</div>}
            {!loading && <HomaPageContainer/>}
        </>
    );
}
