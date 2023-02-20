import { Flex } from '@chakra-ui/react';
import React, { ReactNode } from 'react';

type PageContentProps = {
    children: ReactNode;
};

const PageContent:React.FC<PageContentProps> = ({ children }) => {
    return (
        <Flex justify='center' pb='16px'>
            <Flex justify='center' width='95%' maxWidth='860px'>
                <Flex
                    direction='column'
                    width={{ base: '100%', md: '65%' }}
                    mr={{base: 0, md: 6}}
                    pt={{ base: 'none', md: '16px'}}
                >
                    {children && children[0 as keyof typeof children]}
                </Flex>
                <Flex
                    direction='column'
                    display={{ base:'none', md:'flex'}}
                    flexGrow={1} 
                    pt={{ base: 'none', md: '16px'}}               
                >
                    {children && children[1 as keyof typeof children]}
                </Flex>
            </Flex>
        </Flex>
    )
}
export default PageContent;