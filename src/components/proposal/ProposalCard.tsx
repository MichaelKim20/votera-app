import React, { useContext } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Platform, ImageURISource } from 'react-native';
import { Button, Text } from 'react-native-elements';
import dayjs from 'dayjs';
import { useAssets } from 'expo-asset';
import { ThemeContext } from 'styled-components/native';
import globalStyle from '~/styles/global';
import { Proposal, Enum_Proposal_Type as EnumProposalType } from '~/graphql/generated/generated';
import getString from '~/utils/locales/STRINGS';
import { ClearIcon } from '~/components/icons';
import StatusBar from '../status/StatusBar';
import Period from '../status/Period';

const styles = StyleSheet.create({
    contents: { borderBottomWidth: 1, paddingVertical: 32 },
    fontDescriptions: { fontSize: 13, lineHeight: 23 },
    fontTitles: { fontSize: 14, lineHeight: 23 },
    periods: { fontSize: 12, letterSpacing: 0.48, lineHeight: 20 },
    types: { fontSize: 11, lineHeight: 19, paddingRight: 13 },
    votingPeriodWithBtn: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'android' ? 0 : 3,
    },
});

enum EnumIconAsset {
    ArrowGrad = 0,
}

// eslint-disable-next-line global-require, import/extensions
const iconAssets = [require('@assets/icons/arrow/arrowGrad.png')];

interface ProposalCardProps {
    item: Proposal;
    temp?: boolean;
    onPress: () => void;
    onDelete?: () => void;
    savedTime?: number;
}

function ProposalCard(props: ProposalCardProps): JSX.Element {
    const { item, temp, savedTime, onPress, onDelete } = props;
    const { name: title, description, type, status, assessPeriod, votePeriod } = item;
    const [assets] = useAssets(iconAssets);
    const themeContext = useContext(ThemeContext);

    return (
        <TouchableOpacity
            style={[styles.contents, { borderBottomColor: themeContext.color.divider }]}
            onPress={onPress}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <StatusBar type={type} status={status} deadline={votePeriod?.end as string} temp={!!temp} />
                {temp && (
                    <Button
                        icon={<ClearIcon color="black" />}
                        type="clear"
                        onPress={() => {
                            if (onDelete) onDelete();
                        }}
                    />
                )}
            </View>
            <View style={{ paddingVertical: Platform.OS === 'android' ? 13 : 13 }}>
                <Text style={[globalStyle.btext, styles.fontTitles, { color: themeContext.color.black }]}>{title}</Text>
                <Text
                    numberOfLines={1}
                    style={[globalStyle.rtext, styles.fontDescriptions, { color: themeContext.color.textBlack }]}
                >
                    {description}
                </Text>
                {temp ? (
                    <View style={{ flexDirection: 'row', marginTop: Platform.OS === 'android' ? 0 : 10 }}>
                        <Text style={[globalStyle.mtext, styles.types, { color: themeContext.color.textBlack }]}>
                            {getString('마지막 저장일')}
                        </Text>
                        <Text style={[globalStyle.rltext, styles.periods, { color: themeContext.color.textBlack }]}>
                            {dayjs(savedTime).format(getString('YYYY년 M월 D일 HH:mm'))}
                        </Text>
                    </View>
                ) : (
                    <View style={{ paddingTop: Platform.OS === 'android' ? 0 : 13 }}>
                        {type === EnumProposalType.Business && assessPeriod && (
                            <Period
                                type={getString('평가기간')}
                                created={assessPeriod?.begin as string}
                                deadline={assessPeriod?.end as string}
                            />
                        )}
                        <View style={styles.votingPeriodWithBtn}>
                            <Period
                                type={getString('투표기간')}
                                created={votePeriod?.begin as string}
                                deadline={votePeriod?.end as string}
                            />
                            {assets && (
                                <Image
                                    style={{ marginLeft: 17 }}
                                    source={assets[EnumIconAsset.ArrowGrad] as ImageURISource}
                                />
                            )}
                        </View>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

export default ProposalCard;

ProposalCard.defaultProps = {
    temp: false,
    onDelete: undefined,
    savedTime: undefined,
};
