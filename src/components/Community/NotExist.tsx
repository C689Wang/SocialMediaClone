import { Text, Button, Flex } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';

const NotExist:React.FC = () => {
    return (
        <Flex
            direction='column'
            justifyContent='center'
            alignItems='center'
            minHeight='60vh'
        >
            <Text fontSize='18px' mb='20px' fontWeight={400}>
                Sorry, there aren't any communities on Reddit with that name
            </Text>
            <Text fontSize='14px' mb="32px" fontWeight={400}>
                This community may have been banned or the community name is incorrect
            </Text>
            <Link href="/">
                <Button mt={4}>GO HOME</Button>
            </Link>
        </Flex>
    )
}
export default NotExist;