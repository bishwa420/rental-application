export const users = {
    userList: [
        {
            userId: 1,
            name: "Alex",
            email: "alex@gmail.com",
            status: "VERIFIED",
            isSuspended: false,
            role: "ADMIN",
            updatedAt: "2021-01-21"
        },
        {
            userId: 2,
            name: "Bob",
            email: "bob@gmail.com",
            status: "NOT_VERIFIED",
            isSuspended: true,
            role: "REALTOR",
            updatedAt: "2021-01-21"
        },
        {
            serId: 3,
            name: "Cassandra",
            email: "cassandra@gmail.com",
            status: "VERIFIED",
            isSuspended: true,
            role: "CLIENT",
            updatedAt: "2021-01-21"
        }
    ],

    page: {
        firstPage: true,
        lastPage: true,
        number: 1,
        totalPages: 1,
        size: 10,
        totalItems: 3
    }
}