const provider = provide((state, props: { userIdFromUrl: string }) => {
    return {
        user: state.users[userIdFromUrl]
    };
}, { ...UserActions }).withExternalProps<{ userIdFromUrl: string }>();

export type Props = typeof provider.allProps;
export const MyComponent = provider.connect(MyComponentClass);
