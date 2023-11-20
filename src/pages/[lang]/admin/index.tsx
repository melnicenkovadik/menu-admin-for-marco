import React, {useEffect, useState} from "react";
import {GetStaticPaths, GetStaticProps} from "next";
import {getAllIds} from "../../../lib/files";
import AdminPanelContainer from "../../../containers/admin-panel";
import axios from "axios";

type AdminProps = {
    locale: string;
    categories: any;
};

export default function Admin(props: AdminProps) {
    const [categories, setCategories] = useState([]);
    const fetchCategories = async () => {
        try {
            const res = await axios.get("/api/categories");

            console.log("fetchCategories res", res?.data?.data);
            setCategories(res?.data?.data || []);

        } catch (e) {
            console.log(e);
            setCategories([]);
        }
    }
    useEffect(() => {
        fetchCategories();
    }, []);
    return (
        <AdminPanelContainer defaultCategories={categories} {...props} />
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
