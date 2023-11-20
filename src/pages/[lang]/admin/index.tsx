import React from "react";
import {GetStaticPaths, GetStaticProps} from "next";
import {getAllIds} from "../../../lib/files";
import AdminPanelContainer from "../../../containers/admin-panel";
import axios from "axios";

type AdminProps = {
    locale: string;
    categories: any;
};

export default function Admin(props: AdminProps) {
    return (
        <AdminPanelContainer {...props} />
    );
}

export const getStaticProps: GetStaticProps = async ({params}) => {
    let categories = [];
    try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/categories");
        const data = await res.json();
        categories = data?.data || [];

    } catch (e) {
        console.log(e);
        categories = [];
    }
    return {
        props: {
            categories: categories || [],
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
