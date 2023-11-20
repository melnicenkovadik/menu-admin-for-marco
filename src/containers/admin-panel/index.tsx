import React, {useEffect, useState} from "react";
import Loader from "../../components/Loader";
import {useRecoilState} from "recoil";
import {categoriesState} from "../../store/atoms/categories";
import {CreateCategoryForm} from "../../components/forms/create-cat-form";
import CategoryList from "../../components/CategoryList";

const AdminPanelContainer = (props) => {
    const [categories, setCategories] = useRecoilState(categoriesState);

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setCategories(props?.categories || []);
        setLoading(false);
    }, []);

    return (
        <section className="admin-panel">
            {
                loading ? (
                    <Loader/>
                ) : (
                    <>
                        <CreateCategoryForm/>
                        <CategoryList categories={categories || props?.categories || []}/>
                    </>
                )
            }
        </section>
    );
};

export default AdminPanelContainer;





