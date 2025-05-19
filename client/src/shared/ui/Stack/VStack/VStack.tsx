import React, { memo } from 'react';
import { Flex, FlexProps } from '../Flex/Flex';

type VStackProps = Omit<FlexProps, 'direction'>;

export const VStack = memo(
    React.forwardRef<HTMLDivElement, VStackProps>((props, ref) => {
        return (
            <Flex
                ref={ref}
                {...props}
                direction="column"
            />
        );
    }),
);
