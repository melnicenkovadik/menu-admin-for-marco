import React, {useEffect, useState} from "react";
import Loader from "../../components/Loader";
import {CreateCategoryForm} from "../../components/forms/create-cat-form";
import CategoryList from "../../components/CategoryList";

const AdminPanelContainer = ({categories,...props}) => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
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
                        <CategoryList categories={categories || []}/>
                    </>
                )
            }
        </section>
    );
};

export default AdminPanelContainer;





