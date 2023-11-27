import HomaPageContainer from "../containers/home-page";
import {useRecoilState} from "recoil";
import {categoriesState} from "../store/atoms/categories";
import axios from "axios";
import {useEffect, useState} from "react";
import { langState } from '../store/atoms/lang';

export default function Home({}) {
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

export async function getStaticProps() {
    // const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/languages");
    return {
        props: {
            // allLanguages: languages?.data?.data || [],
        },
    };
}
