export const courseUser= [
    {
        subscriber: {
            id: 0,
            username: "Test",
            email: "test@user"
            password: "Test123"
        },
        course: {
            id: 0,
            name: "Advanced Web Technologies",
            description: "Test Description"
        },
        timeline: {
            origin:{
                tasks: [{
                    id: 0
                    type: 'Assignment',
                    data: [new Date('2023-03-12')]
                },{
                    id: 1,
                    type: "Quiz",
                    data: [new Date('2023-05-12'),
                    new Date('2023-06-12')]
                }],
                milestones: [{
                    id: 0,
                    type: "Lecture",
                    data: [new Date('2023-06-21')]
                }, {
                    id: 1,
                    type: "Exercise",
                    data: [new Date('2023-06-21')]
                },{
                    id: 2,
                    type: "Exam",
                    data: [new Date('2023-07-28')]
                }]

            }
        },
        {
            subscriber: {
                id: 1,
                username: "Test2",
                email: "test2@user"
                password: "Test1234"
            },
            course: {
                id: 0,
                name: "Advanced Web Technologies",
                description: "Test Description"
            },
            timeline: {
                origin:{
                    tasks: [{
                        id: 0
                        type: 'Assignment',
                        data: [new Date('2023-03-12')]
                    },{
                        id: 1,
                        type: "Quiz",
                        data: [new Date('2023-05-12'),
                        new Date('2023-06-12')]
                    }],
                    milestones: [{
                        id: 0,
                        type: "Lecture",
                        data: [new Date('2023-06-21')]
                    }, {
                        id: 1,
                        type: "Exercise",
                        data: [new Date('2023-06-21')]
                    },{
                        id: 2,
                        type: "Exam",
                        data: [new Date('2023-07-28')]
                    }]
    
                }
            }
        }
    }
]
