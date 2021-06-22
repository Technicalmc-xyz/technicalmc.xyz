
export const publicizeArticle = async (id: number) => {
    fetch(`/api/admin/articles/publicize/${id}`, {
        method: "post",
    }).then((r) => r);
};


export const featureArticle = async (id: number) => {
    fetch(`/api/admin/articles/feature/${id}`, {
        method: "post",
    }).then((r) => r);
};

export const removeArticle = async (id: number) => {
    fetch(`/api/admin/articles/remove/${id}`, {
        method: "post",
    }).then((r) => r);
};
