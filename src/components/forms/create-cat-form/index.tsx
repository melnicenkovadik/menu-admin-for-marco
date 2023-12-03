import {Accordion, AccordionItem, Button, Card, CardBody, Divider, Input} from "@nextui-org/react";
import { useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import React  from "react";
import toast from "react-hot-toast";
import {useRecoilState} from "recoil";
import {categoriesState} from "../../../store/atoms/categories";
import axios from "axios";
import useTranslation from '../../../hooks/useTranslation';

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


export const CreateCategoryForm = ({defaultValues = null}) => {
    const { t } = useTranslation();

    return (
        <>
            <Card>
                <CardBody>
                    <Accordion>
                        <AccordionItem
                            key="1"
                            aria-label="Create Category Form"
                            subtitle={t('pressToCreateCategory')}
                            title={t('createCategoryForm')}
                        >
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
    const { t } = useTranslation();
    const [, setCategories] = useRecoilState(categoriesState);

    const {
        handleSubmit,
        register,
        reset,
        formState: { isSubmitting, isDirty, isValid},
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
            const updatedCat  = await axios.put(process.env.NEXT_PUBLIC_API_URL +  `/api/categories`, {
                categoryID: defaultValues._id,
                newCategory: newCategory
            });

            setCategories((prev) => prev.map((cat) => {
                if (cat._id === defaultValues._id) {
                    return updatedCat.data.data
                }
                return cat;
            }));
            toast.success(t('categoryUpdated'));
            closeModal && closeModal();

        } else {
            const newCat = await axios.post(process.env.NEXT_PUBLIC_API_URL +  "/api/categories", newCategory);
            setCategories((prev) => [...prev, newCat?.data?.data]);
            toast.success(t('categoryCreated'));
        }
        closeModal && closeModal();
        reset();
    }

    return (
        <form className="w-full flex flex-col gap-3 md:gap-6"
              onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-3 md:gap-6 md:flex-col">
                <label htmlFor="categoryName" className="text-sm md:text-base font-medium text-gray-700">
                    {t('categoryName')}
                </label>
                <Input isRequired
                       variant="bordered"
                       size="sm"
                       type="text"
                       label={`${t('categoryName')} EN`}
                       defaultValue={defaultValues?.categoryName.en}
                       {...register("categoryName.en")}

                />
                <Input isRequired
                       variant="bordered"
                       size="sm"
                       type="text"
                       label={`${t('categoryName')} UA`}
                       defaultValue={defaultValues?.categoryName.ua}
                       {...register("categoryName.ua")}
                />
                <Input isRequired
                       variant="bordered"
                       size="sm"
                       type="text"
                       label={`${t('categoryName')} IT`}
                       defaultValue={defaultValues?.categoryName.it}
                       {...register("categoryName.it")}
                />
            </div>
            <div className="flex flex-col gap-3 md:gap-6 md:flex-col">
                <label htmlFor="categoryDescription" className="text-sm md:text-base font-medium text-gray-700">
                    {t('categoryDescription')}
                </label>
                <Input
                       variant="bordered"
                       size="sm"
                       type="text"
                       label={`${t('categoryDescription')} EN`}
                       defaultValue={defaultValues?.categoryDescription.en}
                       {...register("categoryDescription.en")}
                />
                <Input
                       variant="bordered"
                       size="sm"
                       type="text"
                       label={`${t('categoryDescription')} UA`}
                       defaultValue={defaultValues?.categoryDescription.ua}
                       {...register("categoryDescription.ua")}
                />
                <Input
                       variant="bordered"
                       size="sm"
                       type="text"
                       label={`${t('categoryDescription')} IT`}
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
                    {isSubmitting ? t('submitting') : t('submit')}
                </Button>
            </div>
        </form>
    );
};
