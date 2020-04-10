const components = {
    CommentCheck: () =>
        import ("./home/CommentCheck"),
    paging: () =>
        import ("./common/paging"),
    topic: () =>
        import ("./home/topic"),
    circles: () =>
        import ("./home/circles"),
    active: () =>
        import ("./home/active"),
	integral: () =>
	    import ("./home/integral"),
    user: () =>
        import ("./home/user"),
    dynamic: () =>
        import ("./home/dynamic"),
    advert: () =>
        import ("./home/advert"),
    department: () =>
        import ("./home/department"),
    personnel: () =>
        import ("./home/personnel"),
    manuscript: () =>
        import ("./home/manuscript"),
    report: () =>
        import ("./home/report"),
    subscription: () =>
        import ("./home/subscription"),
    complaint: () =>
        import ("./home/complaint"),
    feedback: () =>
        import ("./home/feedback")
};
export default {
    install(Vue) {
        for (let key in components) {
            Vue.component(key, components[key]);
        }
    }
};
