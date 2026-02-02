import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../components/common/Button';

describe('Button Component', () => {
  it('should render with label', () => {
    const { getByText } = render(
      <Button label="테스트 버튼" onPress={() => {}} />,
    );

    expect(getByText('테스트 버튼')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button label="클릭" onPress={onPressMock} />,
    );

    fireEvent.press(getByText('클릭'));

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button label="비활성화" onPress={onPressMock} disabled />,
    );

    fireEvent.press(getByText('비활성화'));

    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('should show loading indicator when loading', () => {
    const { getByTestId, queryByText } = render(
      <Button label="로딩중" onPress={() => {}} loading testID="button" />,
    );

    expect(getByTestId('button-loading')).toBeTruthy();
    expect(queryByText('로딩중')).toBeNull();
  });

  describe('variants', () => {
    it('should render primary variant with correct styles', () => {
      const { getByTestId } = render(
        <Button
          label="Primary"
          variant="primary"
          onPress={() => {}}
          testID="button"
        />,
      );

      const button = getByTestId('button');
      expect(button.props.style).toContainEqual(
        expect.objectContaining({ backgroundColor: '#FFD43B' }),
      );
    });

    it('should render secondary variant', () => {
      const { getByTestId } = render(
        <Button
          label="Secondary"
          variant="secondary"
          onPress={() => {}}
          testID="button"
        />,
      );

      expect(getByTestId('button')).toBeTruthy();
    });

    it('should render outline variant', () => {
      const { getByTestId } = render(
        <Button
          label="Outline"
          variant="outline"
          onPress={() => {}}
          testID="button"
        />,
      );

      const button = getByTestId('button');
      expect(button.props.style).toContainEqual(
        expect.objectContaining({ borderWidth: 1 }),
      );
    });
  });

  describe('sizes', () => {
    it('should render small size', () => {
      const { getByTestId } = render(
        <Button
          label="Small"
          size="sm"
          onPress={() => {}}
          testID="button"
        />,
      );

      const button = getByTestId('button');
      expect(button.props.style).toContainEqual(
        expect.objectContaining({ paddingVertical: 8 }),
      );
    });

    it('should render medium size (default)', () => {
      const { getByTestId } = render(
        <Button label="Medium" onPress={() => {}} testID="button" />,
      );

      const button = getByTestId('button');
      expect(button.props.style).toContainEqual(
        expect.objectContaining({ paddingVertical: 12 }),
      );
    });

    it('should render large size', () => {
      const { getByTestId } = render(
        <Button
          label="Large"
          size="lg"
          onPress={() => {}}
          testID="button"
        />,
      );

      const button = getByTestId('button');
      expect(button.props.style).toContainEqual(
        expect.objectContaining({ paddingVertical: 16 }),
      );
    });
  });

  it('should render with icon', () => {
    const MockIcon = () => <></>;
    const { getByTestId } = render(
      <Button
        label="아이콘 버튼"
        icon={<MockIcon />}
        onPress={() => {}}
        testID="button"
      />,
    );

    expect(getByTestId('button-icon')).toBeTruthy();
  });

  it('should render full width when fullWidth is true', () => {
    const { getByTestId } = render(
      <Button
        label="Full Width"
        fullWidth
        onPress={() => {}}
        testID="button"
      />,
    );

    const button = getByTestId('button');
    expect(button.props.style).toContainEqual(
      expect.objectContaining({ width: '100%' }),
    );
  });
});
