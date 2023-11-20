import {Accordion, AccordionItem, Button, Card, CardBody, Divider, Input} from "@nextui-org/react";
import { useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

type FormData = z.infer<typeof createCategorySchema>;
const createCategorySchema = z.object({
    categoryName: z.object({
        en: z.string().min(3).max(200),
        ua: z.string().min(3).max(200),
        it: z.string().min(3).max(200),
    }),
    categoryDescription: z.object({
        en: z.string().max(200),
        ua: z.string().max(200),
        it: z.string().max(200),
    }),
});

import React  from "react";
import toast from "react-hot-toast";
import {useRecoilState} from "recoil";
import {categoriesState} from "../../../store/atoms/categories";
import axios from "axios";

export const CreateCategoryForm = ({defaultValues = null}) => {

    return (
        <>
            <Card>
                <CardBody>
                    <Accordion>
                        <AccordionItem
                            key="1"
                            aria-label="Create Category Form"
                            subtitle="Press to create new category"
                            title="Create Category Form">
                            <CategoryForm defaultValues={defaultValues}/>
                        </AccordionItem>
                    </Accordion>
                </CardBody>
            </Card>
            <Divider className="my-5"/>
        </>
    );

};

export const CategoryForm = ({defaultValues = null, closeModal = null}: any) => {
    const isEditMode = !!defaultValues;
    const [categories, setCategories] = useRecoilState(categoriesState);
    // const length = useRecoilValue(lengthState);
    console.log('defaultValues',defaultValues);
    const {
        handleSubmit,
        register,
        reset,
        setValue,
        unregister,
        trigger,
        setFocus,
        formState: {errors, isSubmitting, isDirty, isValid},
    } = useForm<FormData>({
        resolver: zodResolver(createCategorySchema),
        mode: "all",
        defaultValues: {
            categoryName: {
                en: defaultValues?.categoryName.en || "",
                ua: defaultValues?.categoryName.ua || "",
                it: defaultValues?.categoryName.it || "",
            },
            categoryDescription: {
                en: defaultValues?.categoryDescription.en || "",
                ua: defaultValues?.categoryDescription.ua || "",
                it: defaultValues?.categoryDescription.it || "",
            },
        },
    });

    async function onSubmit(data: FormData) {
        let newCategory = {};
        if (isEditMode) {
            newCategory = {
                categoryName: {
                    en: data.categoryName.en,
                    ua: data.categoryName.ua,
                    it: data.categoryName.it,
                },
                categoryDescription: {
                    en: data.categoryDescription.en,
                    ua: data.categoryDescription.ua,
                    it: data.categoryDescription.it,
                },
            };
        } else {
            newCategory = {
                categoryName: {
                    en: data.categoryName.en,
                    ua: data.categoryName.ua,
                    it: data.categoryName.it,
                },
                categoryDescription: {
                    en: data.categoryDescription.en,
                    ua: data.categoryDescription.ua,
                    it: data.categoryDescription.it,
                },
                products: [],
            };
        }

        if (isEditMode) {
            // const updatedCat = await fetch(`/api/categories`, {
            //     method: "PUT",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify({
            //         categoryID: defaultValues._id,
            //         newCategory: newCategory
            //     }),
            //     next: {revalidate: 3600}
            // });
            const updatedCat  = await axios.put(`/api/categories`, {
                categoryID: defaultValues._id,
                newCategory: newCategory
            });

            console.log("updatedCatData", updatedCat);
            setCategories((prev) => prev.map((cat) => {
                if (cat._id === defaultValues._id) {
                    return updatedCat.data.data
                }
                return cat;
            }));
            toast.success("Category updated successfully!");
            closeModal && closeModal();

        } else {
            const newCat = await axios.post("/api/categories", newCategory);
            setCategories((prev) => [...prev, newCat?.data?.data]);
            toast.success("Category created successfully!");
        }

        closeModal && closeModal();
        reset();
    }

    return (
        <form className="w-full flex flex-col gap-3 md:gap-6"
              onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-3 md:gap-6 md:flex-col">
                <label htmlFor="categoryName" className="text-sm md:text-base font-medium text-gray-700">
                    Category Name
                </label>
                <Input isRequired
                       variant="bordered"
                       size="sm"
                       type="text"
                       label="Category Name EN"
                       defaultValue={defaultValues?.categoryName.en}
                       {...register("categoryName.en")}

                />
                <Input isRequired
                       variant="bordered"
                       size="sm"
                       type="text"
                       label="Category Name UA"
                       defaultValue={defaultValues?.categoryName.ua}
                       {...register("categoryName.ua")}
                />
                <Input isRequired
                       variant="bordered"
                       size="sm"
                       type="text"
                       label="Category Name IT"
                       defaultValue={defaultValues?.categoryName.it}
                       {...register("categoryName.it")}
                />
            </div>

            <div className="flex flex-col gap-3 md:gap-6 md:flex-col">
                <label htmlFor="categoryDescription" className="text-sm md:text-base font-medium text-gray-700">
                    Category Description
                </label>
                <Input
                       variant="bordered"
                       size="sm"
                       type="text"
                       label="Category Description EN"
                       defaultValue={defaultValues?.categoryDescription.en}
                       {...register("categoryDescription.en")}
                />
                <Input
                       variant="bordered"
                       size="sm"
                       type="text"
                       label="Category Description UA"
                       defaultValue={defaultValues?.categoryDescription.ua}
                       {...register("categoryDescription.ua")}
                />
                <Input
                       variant="bordered"
                       size="sm"
                       type="text"
                       label="Category Description IT"
                       defaultValue={defaultValues?.categoryDescription.it}
                       {...register("categoryDescription.it")}
                />
            </div>

            <div className="flex flex-row gap-3 items-center justify-start">
                <Button size="sm"
                        type="submit"
                        disabled={!isDirty || !isValid || isSubmitting}
                        className="max-w-xs p-4 mb-5"
                        color={isDirty && isValid ? "primary" : "default"}
                >
                    {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
            </div>
        </form>
    );
};
