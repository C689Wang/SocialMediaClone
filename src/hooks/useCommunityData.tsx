import { authModalState } from '@/atoms/authModalAtom';
import { communitiesState, Community, CommunitySnippet } from '@/atoms/communitiesAtom';
import { auth, firestore } from '@/firebase/clientApp';
import { collection, deleteDoc, doc, FieldPath, getDoc, getDocs, increment, query, where, writeBatch } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useSetRecoilState } from 'recoil';

const useCommunityData = () => {
    const [user] = useAuthState(auth);
    const [communityStateValue, setCommunityStateValue] = useRecoilState(communitiesState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const setAuthModalState = useSetRecoilState(authModalState);
    const router = useRouter();

    const onJoinOrLeaveCommunity = (communityData: Community, isJoined: boolean) => {
        if (!user) {
            // if user not signed in, prompt user to sign in with modal
            setAuthModalState({ open: true, view: 'login' });
            return;
        }
        setLoading(true);
        if (isJoined) {
            leaveCommunity(communityData.id);
            return;
        }
        joinCommunity(communityData);
    }

    const getMySnippets = async () => {
        setLoading(true);
        try {
            // get user snippets
            const snippetDocs = await getDocs(collection(firestore, `users/${user?.uid}/communitySnippets`))
            const snippets = snippetDocs.docs.map(doc => ({ ...doc.data() })) as CommunitySnippet[];
            let names = snippets.map(snippet => snippet.communityId) as string[];
            if (names.length != 0) {
                let limit = 10;
                let communities = [] as Community[];
                while (names.length) {
                    const communityQuery = query(collection(firestore, 'communities'), where('name', 'in', names.slice(0, limit)));
                    const communityDocs = await getDocs(communityQuery);
                    const _communities = communityDocs.docs.map(doc => ({ ...doc.data() })) as Community[];
                    communities.push(..._communities);
                    names.splice(0, limit);
                }
                const newSnippets = snippets.map(snippet => {
                    const index = communities.findIndex(comm => comm.name === snippet.communityId);
                    if (communities[index] != undefined) {
                        return ({
                            ...snippet,
                            imageURL: communities[index].imageURL,
                        })
                    } else {
                        return snippet
                    }
                })
                setCommunityStateValue((prev) => ({
                    ...prev,
                    mySnippets: newSnippets as unknown as CommunitySnippet[],
                    snippetsFetched: true
                }));
            }
        } catch (error: any) {
            console.log('getMySnippets', error);
            setError(error.message)
        }
        setLoading(false);
    };

    const joinCommunity = async (communityData: Community) => {
        // batch write
        // creating a new community snippet for the user
        // updating the numberOfMembers
        try {
            const batch = writeBatch(firestore);

            const newSnippet: CommunitySnippet = {
                communityId: communityData.id,
                imageURL: communityData.imageURL || "",
                isModerator: user?.uid === communityData.creatorId
            }

            batch.set(doc(firestore, `users/${user?.uid}/communitySnippets`, communityData.id), newSnippet)
            batch.update(doc(firestore, 'communities', communityData.id), { numberOfMembers: increment(1) })
            await batch.commit();
            // update recoil state (communitiesState.mySnippets)
            setCommunityStateValue(prev => ({
                ...prev,
                mySnippets: [...prev.mySnippets, newSnippet]
            }))
        } catch (error: any) {
            console.log('joinCommunity error', error);
            setError(error.message);
        }
        setLoading(false);
    };
    const leaveCommunity = async (communityId: string) => {
        // batch write
        // deleting the community snippet from the user
        // updating the numberOfMembers
        try {
            const batch = writeBatch(firestore);

            // checks if user is a moderator
            const snippetIndex = communityStateValue.mySnippets.findIndex((item) => item.communityId === communityId);
            const isMod = !!communityStateValue.mySnippets[snippetIndex].isModerator

            if (!isMod) {
                batch.delete(doc(firestore, `users/${user?.uid}/communitySnippets`, communityId))
                batch.update(doc(firestore, 'communities', communityId), { numberOfMembers: increment(-1) })
                await batch.commit();
                // update recoil state (communitiesState.mySnippets)
                setCommunityStateValue(prev => ({
                    ...prev,
                    mySnippets: prev.mySnippets.filter((item) => item.communityId !== communityId)
                }))
            }
        } catch (error: any) {
            console.log('leaveCommunity error', error);
            setError(error.message);
        }
        setLoading(false);
    };

    const getCommunityData = async (communityId: string) => {
        try {
            const communityDocRef = doc(firestore, 'communities', communityId);
            const communityDoc = await getDoc(communityDocRef);

            setCommunityStateValue(prev => ({
                ...prev,
                currentCommunity: { id: communityDoc.id, ...communityDoc.data() } as Community
            }
            ))
        } catch (error) {
            console.log('getCommunityData error', error)
        }
    }

    useEffect(() => {
        if (!user) {
            setCommunityStateValue(prev => ({
                ...prev,
                mySnippets: [],
                snippetsFetched: false
            }));
            return;
        };
        getMySnippets();
    }, [user]);

    useEffect(() => {
        const { communityId } = router.query;
        if (communityId && !communityStateValue.currentCommunity) {
            getCommunityData(communityId as string);
        }
        const { currentCommunity } = communityStateValue;
        if (currentCommunity) {
            getMySnippets();
        }
    }, [router.query, communityStateValue.currentCommunity])

    return {
        communityStateValue,
        onJoinOrLeaveCommunity,
        loading
    };
}
export default useCommunityData;