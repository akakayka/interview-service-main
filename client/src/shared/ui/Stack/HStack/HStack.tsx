import { memo } from 'react';
import { Flex, FlexProps } from '../Flex/Flex';

type HStackProps = Omit<FlexProps, 'direction'>;

export const HStack = memo((props: HStackProps) => {
    const { align = 'center' } = props;
    return (
        <Flex
            align={align}
            {...props}
            direction="row"
        />
    );
});
