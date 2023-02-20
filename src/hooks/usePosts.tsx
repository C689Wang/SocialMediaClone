import { authModalState } from '@/atoms/authModalAtom';
import { communitiesState } from '@/atoms/communitiesAtom';
import { Post, postState, PostVote } from '@/atoms/postsAtom';
import { auth, firestore, storage } from '@/firebase/clientApp';
import { collection, deleteDoc, doc, getDoc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';


const usePosts = () => {
    const router = useRouter();
    const [user] = useAuthState(auth);
    const [postStateValue, setPostStateValue] = useRecoilState(postState);
    const currentCommunity = useRecoilValue(communitiesState).currentCommunity;
    const setAuthModalState = useSetRecoilState(authModalState)

    const onVote = async (event: React.MouseEvent<SVGElement, MouseEvent>, post: Post, vote: number, communityId: string) => {
        event.stopPropagation();
        // check for a user => if not, open auth modal
        if (!user?.uid) {
            setAuthModalState({ open: true, view: 'login'})
            return;
        }

        try {
            const { voteStatus } = post;
            const existingVote = postStateValue.postVotes.find((vote) => vote.postId === post.id);

            const batch = writeBatch(firestore);
            const updatedPost = { ...post };
            const updatedPosts = [ ...postStateValue.posts ];
            let updatedPostVotes = [...postStateValue.postVotes]
            let voteChange = vote;

            // new vote
            if (!existingVote) {
                // add/subtract 1 to/from post.voteStatus
                // create a new postVote document
                const postVoteRef = doc(collection(firestore, 'users', `${user?.uid}/postVotes`));
                
                const newVote: PostVote = {
                    id: postVoteRef.id,
                    postId: post.id!,
                    communityId,
                    voteValue: vote, // 1 or -1
                };

                batch.set(postVoteRef, newVote);

                // add/subtract 1 to/from post.voteStatus
                updatedPost.voteStatus = voteStatus + vote;
                updatedPostVotes = [...updatedPostVotes, newVote];
            }
            // existing vote - they have voted on the post before
            else {
                const postVoteRef = doc(firestore, 'users', `${user?.uid}/postVotes/${existingVote.id}`);
                // removing their vote (up => neutral OR down => neutral)
                // delete the postVote document
                if (existingVote.voteValue === vote) {
                    voteChange *= -1;
                    // add/subtract 1 to/from post.voteStatus
                    updatedPost.voteStatus = voteStatus - vote;
                    updatedPostVotes = updatedPostVotes.filter((vote) => vote.id !== existingVote.id);
                     // delete the postVote document
                     batch.delete(postVoteRef);
                }
                // Flipping their vote (up => down or down => up)
                else {
                    voteChange = 2 * vote;
                    // add/subtract 2 to/from post.voteStatus
                    updatedPost.voteStatus = voteStatus + 2 * vote;
                    const voteIndex = postStateValue.postVotes.findIndex((vote) => vote.id === existingVote.id);
                    updatedPostVotes[voteIndex] = {...existingVote, voteValue:vote}
                    // update the existing postVote document
                    batch.update(postVoteRef, {
                        voteValue: vote,
                    });
                }
            }
            // update state with updated values
            const postIndex = postStateValue.posts.findIndex((item) => item.id === post.id);
            updatedPosts[postIndex] = updatedPost;
            setPostStateValue(prev => ({
                ...prev,
                posts: updatedPosts,
                postVotes: updatedPostVotes
            }));

            if (postStateValue.selectedPost) {
                setPostStateValue(prev => ({
                    ...prev,
                    selectedPost: updatedPost,
                }));
            }

            // update the post document
            const postRef = doc(firestore, 'posts', post.id!);
            batch.update(postRef, { voteStatus: voteStatus + voteChange })

            await batch.commit();
            
        } catch (error: any) {
            console.log('onVote error', error)
        }
        
    };

    const onSelectPost = (post: Post) => {
        setPostStateValue(prev => ({
            ...prev,
            selectedPost: post
        }));
        router.push(`/r/${post.communityId}/comments/${post.id}`)
    };
    
    const onDeletePost = async (post: Post): Promise<boolean> => {
        try {
            // check if image exists, delete if so
            if (post.imageURL) {
                const imageRef = ref(storage, `posts/${post.id}/image`)
                await deleteObject(imageRef);
            }

            // delete post document from firestore
            const postDocRef = doc(firestore, 'posts', post.id!);
            await deleteDoc(postDocRef);

            // update recoil state
            setPostStateValue(prev => ({
                ...prev,
                posts: prev.posts.filter(item => item.id !== post.id)
            }))

        } catch (error: any) {
            return false;
        }
        return true;
    };

    const getCommunityPostVotes = async (communityId: string) => {
        const postVotesQuery = query(
            collection(firestore, 'users', `${user?.uid}/postVotes`), 
            where('communityId', '==', communityId)
        )

        const postVotesDocs = await getDocs(postVotesQuery);
        const postVotes = postVotesDocs.docs.map(doc => ({ id: doc.id, ...doc.data()}));
        setPostStateValue(prev => ({
            ...prev,
            postVotes: postVotes as PostVote[],
        }))
    }

    useEffect(() => {
        if (!user || !currentCommunity?.id) return;
        getCommunityPostVotes(currentCommunity?.id);
    }, [user, currentCommunity]);

    useEffect(() => {
        if (!user) {
            // clear user post values
            setPostStateValue((prev) => ({
                ...prev,
                postVotes: [],
            }))
        }
    }, [user]);
    
    return {
        postStateValue,
        setPostStateValue,
        onVote,
        onSelectPost,
        onDeletePost
    }
}
export default usePosts;