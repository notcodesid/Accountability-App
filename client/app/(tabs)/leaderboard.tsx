// import React, { useState, useEffect } from 'react';
// import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, StatusBar, ActivityIndicator } from "react-native";
// import { Ionicons } from '@expo/vector-icons';
// import { Colors, HomeColors, OnboardingColors } from '../../constants/Colors';
// import SafeScreenView from '../../components/SafeScreenView';
// import { LinearGradient } from 'expo-linear-gradient';
// import { getLeaderboard, getUserRank, LeaderboardUser as ApiLeaderboardUser } from '../../services/api';
// import { useAuth } from '../../context/AuthContext';
// import LoadingSpinner from '../../components/LoadingSpinner';

// // Interface for leaderboard user
// interface LeaderboardUser {
//     id: number;
//     name: string;
//     points: number;
//     avatar: string;
//     rank: number;
// }

// export default function Leaderboard() {
//     const { user } = useAuth();
//     const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
//     const [myProfile, setMyProfile] = useState<LeaderboardUser | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         fetchLeaderboardData();
//     }, []);

//     const fetchLeaderboardData = async () => {
//         try {
//             setLoading(true);
//             setError(null);

//             // Fetch leaderboard data
//             const response = await getLeaderboard();

//             if (response.success) {
//                 // Transform API data to match UI format
//                 const transformedData = response.data.map(item => ({
//                     id: item.id,
//                     name: item.name,
//                     points: item.points,
//                     avatar: item.avatar,
//                     rank: item.rank
//                 }));
                
//                 setLeaderboardData(transformedData);
                
//                 // If user is logged in, fetch their rank
//                 if (user?.id) {
//                     try {
//                         // Convert user.id to string to ensure it matches the expected format in the API
//                         const userId = String(user.id);
//                         console.log("Fetching rank for user ID:", userId);
                        
//                         const userRankResponse = await getUserRank(userId);
                        
//                         if (userRankResponse.success) {
//                             const { data } = userRankResponse;
//                             setMyProfile({
//                                 id: data.id,
//                                 name: 'You',
//                                 points: data.points,
//                                 avatar: data.avatar,
//                                 rank: data.actualRank
//                             });
//                         }
//                     } catch (userRankError) {
//                         console.error('Error fetching user rank:', userRankError);
                        
//                         // Try to find user in the leaderboard data as a fallback
//                         if (user.username) {
//                             const userEntry = transformedData.find(entry => 
//                                 entry.name.toLowerCase() === user.username?.toLowerCase()
//                             );
                            
//                             if (userEntry) {
//                                 setMyProfile({
//                                     ...userEntry,
//                                     name: 'You'
//                                 });
//                                 console.log("Found user in leaderboard data:", userEntry);
//                             } else {
//                                 // Create a default profile if fetch fails
//                                 setMyProfile({
//                                     id: 0,
//                                     name: 'You',
//                                     points: 0,
//                                     avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
//                                     rank: transformedData.length + 1
//                                 });
//                             }
//                         } else {
//                             // Create a default profile if fetch fails
//                             setMyProfile({
//                                 id: 0,
//                                 name: 'You',
//                                 points: 0,
//                                 avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
//                                 rank: transformedData.length + 1
//                             });
//                         }
//                     }
//                 } else {
//                     // Default profile for not logged in users
//                     setMyProfile({
//                         id: 0,
//                         name: 'You',
//                         points: 0,
//                         avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
//                         rank: transformedData.length + 1
//                     });
//                 }
//             } else {
//                 setError('Failed to fetch leaderboard data');
//             }
//         } catch (err) {
//             console.error('Error fetching leaderboard:', err);
//             setError('An error occurred while fetching leaderboard data');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Render a ranking item for positions 4 and below
//     const renderRankItem = ({ item }: { item: LeaderboardUser }) => (
//         <View style={styles.rankItem}>
//             <Text style={styles.rankNumber}>{item.rank}</Text>
//             <Image source={{ uri: item.avatar }} style={styles.smallAvatar} />
//             <Text style={styles.rankName}>{item.name}</Text>
//             <View style={styles.rankPoints}>
//                 <Ionicons name="star" size={14} color="#FFD700" />
//                 <Text style={styles.rankPointsText}>{item.points}</Text>
//             </View>
//         </View>
//     );

//     if (loading) {
//         return (
//             <SafeScreenView style={styles.container} backgroundColor={HomeColors.background}>
//                 <StatusBar barStyle="light-content" />
//                 <View style={styles.loadingContainer}>
//                     <LoadingSpinner message="Loading leaderboard..." />
//                 </View>
//             </SafeScreenView>
//         );
//     }

//     if (error) {
//         return (
//             <SafeScreenView style={styles.container} backgroundColor={HomeColors.background}>
//                 <StatusBar barStyle="light-content" />
//                 <View style={styles.errorContainer}>
//                     <Ionicons name="alert-circle-outline" size={60} color={HomeColors.textSecondary} />
//                     <Text style={styles.errorText}>{error}</Text>
//                     <TouchableOpacity 
//                         style={styles.retryButton}
//                         onPress={fetchLeaderboardData}
//                     >
//                         <Text style={styles.retryButtonText}>Try Again</Text>
//                     </TouchableOpacity>
//                 </View>
//             </SafeScreenView>
//         );
//     }

//     // Ensure we have at least 3 items for the top podium
//     const topUsers = leaderboardData.slice(0, 3);
//     while (topUsers.length < 3) {
//         topUsers.push({
//             id: -topUsers.length,
//             name: 'Unknown',
//             points: 0,
//             avatar: 'https://randomuser.me/api/portraits/lego/0.jpg',
//             rank: topUsers.length + 1
//         });
//     }

//     return (
//         <SafeScreenView style={styles.container} backgroundColor={HomeColors.background} scrollable={false}>
//             <StatusBar barStyle="light-content" />
            
//             <View style={styles.selectedHeaderContainer}>
//                 <LinearGradient
//                     colors={['rgba(23, 23, 23, 0.9)', 'rgba(10, 10, 10, 0.95)']}
//                     style={styles.headerGradient}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 0, y: 1 }}
//                 >
//                     <View style={styles.selectedHeaderContent}>
//                         <Text style={styles.selectedHeaderTitle}>Leaderboard</Text>
//                         <Text style={styles.selectedHeaderDetails}>Top performers this month</Text>
//                     </View>
//                 </LinearGradient>
//             </View>

//             <View style={styles.topThree}>
//                 {/* Third place - Left */}
//                 <View style={[styles.topUser, styles.topUserThird]}>
//                     <View style={styles.rankBadge}>
//                         <Text style={styles.rankText}>3</Text>
//                     </View>
//                     <Image source={{ uri: topUsers[2].avatar }} style={styles.avatar} />
//                     <Text style={styles.userName} numberOfLines={1}>{topUsers[2].name}</Text>
//                     <View style={styles.pointsContainer}>
//                         <Ionicons name="star" size={14} color="#FFD700" />
//                         <Text style={styles.pointsText}>{topUsers[2].points}</Text>
//                     </View>
//                 </View>
                
//                 {/* First place - Middle */}
//                 <View style={[styles.topUser, styles.topUserFirst]}>
//                     <View style={styles.rankBadge}>
//                         <Text style={styles.rankText}>1</Text>
//                     </View>
//                     <Image source={{ uri: topUsers[0].avatar }} style={[styles.avatar, styles.avatarFirst]} />
//                     <Text style={styles.userName} numberOfLines={1}>{topUsers[0].name}</Text>
//                     <View style={styles.pointsContainer}>
//                         <Ionicons name="star" size={14} color="#FFD700" />
//                         <Text style={styles.pointsText}>{topUsers[0].points}</Text>
//                     </View>
//                 </View>
                
//                 {/* Second place - Right */}
//                 <View style={[styles.topUser, styles.topUserSecond]}>
//                     <View style={styles.rankBadge}>
//                         <Text style={styles.rankText}>2</Text>
//                     </View>
//                     <Image source={{ uri: topUsers[1].avatar }} style={styles.avatar} />
//                     <Text style={styles.userName} numberOfLines={1}>{topUsers[1].name}</Text>
//                     <View style={styles.pointsContainer}>
//                         <Ionicons name="star" size={14} color="#FFD700" />
//                         <Text style={styles.pointsText}>{topUsers[1].points}</Text>
//                     </View>
//                 </View>
//             </View>

//             <FlatList
//                 data={leaderboardData.slice(3)}
//                 renderItem={renderRankItem}
//                 keyExtractor={item => item.id.toString()}
//                 style={styles.rankingsList}
//                 ListFooterComponent={
//                     myProfile && (
//                         <View style={styles.myRankCard}>
//                             <View style={styles.rankItem}>
//                                 <Text style={[styles.rankNumber, styles.myRankNumber]}>{myProfile.rank}</Text>
//                                 <Image source={{ uri: myProfile.avatar }} style={styles.smallAvatar} />
//                                 <Text style={[styles.rankName, styles.myRankName]}>{myProfile.name}</Text>
//                                 <View style={styles.rankPoints}>
//                                     <Ionicons name="star" size={14} color="#FFD700" />
//                                     <Text style={[styles.rankPointsText, styles.myRankPointsText]}>{myProfile.points}</Text>
//                                 </View>
//                             </View>
//                         </View>
//                     )
//                 }
//             />
//         </SafeScreenView>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     errorContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 20,
//     },
//     errorText: {
//         fontSize: 16,
//         color: HomeColors.textSecondary,
//         textAlign: 'center',
//         marginTop: 10,
//         marginBottom: 20,
//     },
//     retryButton: {
//         backgroundColor: OnboardingColors.accentColor,
//         paddingVertical: 10,
//         paddingHorizontal: 20,
//         borderRadius: 20,
//     },
//     retryButtonText: {
//         color: '#fff',
//         fontWeight: '600',
//     },
//     selectedHeaderContainer: {
//         width: '100%',
//     },
//     headerGradient: {
//         paddingTop: 40,
//         paddingBottom: 15,
//         paddingHorizontal: 20,
//     },
//     selectedHeaderContent: {
//         flexDirection: 'column',
//         position: 'relative',
//     },
//     selectedHeaderTitle: {
//         fontSize: 32,
//         fontWeight: 'bold',
//         color: '#fff',
//         marginBottom: 8,
//     },
//     selectedHeaderDetails: {
//         fontSize: 14,
//         color: 'rgba(255, 255, 255, 0.7)',
//     },
//     topThree: {
//         flexDirection: 'row',
//         justifyContent: 'center',
//         alignItems: 'flex-end',
//         backgroundColor: HomeColors.challengeCard,
//         paddingVertical: 30,
//         paddingHorizontal: 15,
//         marginBottom: 10,
//     },
//     topUser: {
//         alignItems: 'center',
//         width: '30%',
//         position: 'relative',
//     },
//     topUserFirst: {
//         transform: [{translateY: -25}],
//         zIndex: 3,
//     },
//     topUserSecond: {
//         zIndex: 2,
//     },
//     topUserThird: {
//         zIndex: 1,
//     },
//     rankBadge: {
//         position: 'absolute',
//         top: 0,
//         right: '25%',
//         backgroundColor: OnboardingColors.accentColor,
//         width: 24,
//         height: 24,
//         borderRadius: 12,
//         justifyContent: 'center',
//         alignItems: 'center',
//         zIndex: 4,
//         borderWidth: 2,
//         borderColor: HomeColors.challengeCard,
//     },
//     rankText: {
//         color: '#fff',
//         fontWeight: 'bold',
//         fontSize: 12,
//     },
//     avatar: {
//         width: 70,
//         height: 70,
//         borderRadius: 35,
//         borderWidth: 3,
//         borderColor: HomeColors.background,
//     },
//     avatarFirst: {
//         width: 85,
//         height: 85,
//         borderRadius: 42.5,
//         borderWidth: 4,
//         borderColor: '#FFD700',
//     },
//     userName: {
//         fontWeight: 'bold',
//         marginTop: 8,
//         textAlign: 'center',
//         fontSize: 13,
//         width: '90%',
//         color: HomeColors.text,
//     },
//     pointsContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginTop: 4,
//     },
//     pointsText: {
//         fontSize: 12,
//         marginLeft: 3,
//         color: HomeColors.textSecondary,
//     },
//     rankingsList: {
//         flex: 1,
//         backgroundColor: HomeColors.challengeCard,
//     },
//     rankItem: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingVertical: 12,
//         paddingHorizontal: 15,
//         borderBottomWidth: 1,
//         borderBottomColor: 'rgba(255, 255, 255, 0.05)',
//     },
//     rankNumber: {
//         width: 30,
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: HomeColors.textSecondary,
//     },
//     smallAvatar: {
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//     },
//     rankName: {
//         flex: 1,
//         marginLeft: 12,
//         fontSize: 15,
//         fontWeight: '500',
//         color: HomeColors.text,
//     },
//     rankPoints: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     rankPointsText: {
//         fontSize: 14,
//         marginLeft: 4,
//         fontWeight: 'bold',
//         color: HomeColors.text,
//     },
//     myRankCard: {
//         backgroundColor: 'rgba(255, 87, 87, 0.1)', // Subtle accent color background
//         borderTopWidth: 1,
//         borderTopColor: 'rgba(255, 87, 87, 0.2)',
//     },
//     myRankNumber: {
//         color: OnboardingColors.accentColor,
//     },
//     myRankName: {
//         fontWeight: 'bold',
//     },
//     myRankPointsText: {
//         color: OnboardingColors.accentColor,
//     },
// });