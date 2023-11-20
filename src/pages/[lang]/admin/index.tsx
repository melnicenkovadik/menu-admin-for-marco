import React, {useEffect} from "react";
import {GetStaticPaths, GetStaticProps} from "next";
import {getAllIds} from "../../../lib/files";
import AdminPanelContainer from "../../../containers/admin-panel";
import axios from "axios";
import {useRecoilState} from "recoil";
import {categoriesState} from "../../../store/atoms/categories";

type AdminProps = {
    locale: string;
    categories: any;
};

export default function Admin(props: AdminProps) {
    const [categories, setCategories] = useRecoilState(categoriesState);

    const fetchCategories = async () => {
        try {
            const res = await axios.get("/api/categories");

            setCategories(res?.data?.data || []);

        } catch (e) {
            console.log(e);
            setCategories([]);
        }
    };
    useEffect(() => {
        fetchCategories();
    }, []);
    return (
        <AdminPanelContainer categories={categories} {...props} />
    );
}

export const getStaticProps: GetStaticProps = async ({params}) => {

    return {
        props: {
            locale: params?.lang || "en",
        },
    };
};

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = getAllIds();

    return {
        paths,
        fallback: false,
    };
};
