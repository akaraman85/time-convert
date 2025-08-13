import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { ColorScheme, presetColorSchemes } from '../types/colorScheme'
import {
  useColorScheme,
  useAllColorSchemes,
} from '../contexts/ColorSchemeContext'

interface ColorSchemeEditorProps {
  isOpen: boolean
  onClose: () => void
}

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: ${props => (props.isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`

const Modal = styled.div`
  background: var(--color-card-background, rgba(255, 255, 255, 0.95));
  border-radius: 20px;
  padding: 2rem;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-card, 0 20px 40px rgba(0, 0, 0, 0.1));
  backdrop-filter: blur(10px);
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  background: var(
    --color-title-gradient,
    linear-gradient(135deg, #667eea 0%, #764ba2 100%)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-secondary-text, #666);
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--color-input-border, #e1e5e9);
`

const Tab = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  padding: 0.75rem 1rem;
  font-weight: 600;
  cursor: pointer;
  color: ${props => (props.active ? 'var(--color-primary, #667eea)' : 'var(--color-secondary-text, #666)')};
  border-bottom: 2px solid ${props => (props.active ? 'var(--color-primary, #667eea)' : 'transparent')}
  transition: all 0.2s ease
  
  &:hover {
    color: var(--color-primary, #667eea)
  }
`

const SchemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`

const SchemeCard = styled.div<{ isActive: boolean }>`
  border: 2px solid
    ${props =>
      props.isActive
        ? 'var(--color-primary, #667eea)'
        : 'var(--color-input-border, #e1e5e9)'};
  border-radius: 10px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--color-input-background, #ffffff);

  &:hover {
    border-color: var(--color-primary, #667eea);
    transform: translateY(-2px);
    box-shadow: var(--shadow-button, 0 4px 15px rgba(102, 126, 234, 0.4));
  }
`

const SchemePreview = styled.div<{ background: string }>`
  height: 60px;
  border-radius: 8px;
  background: ${props => props.background};
  margin-bottom: 0.5rem;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30px;
    height: 20px;
    background: var(--color-card-background, rgba(255, 255, 255, 0.95));
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`

const SchemeName = styled.div`
  font-weight: 600;
  color: var(--color-primary-text, #1a202c);
  text-align: center;
`

const ColorInputGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`

const ColorGroup = styled.div`
  background: var(--color-input-background, #ffffff);
  border: 1px solid var(--color-input-border, #e1e5e9);
  border-radius: 10px;
  padding: 1rem;
`

const ColorGroupTitle = styled.h4`
  margin: 0 0 1rem 0;
  color: var(--color-primary-text, #1a202c);
  font-weight: 600;
`

const ColorInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;

  &:last-child {
    margin-bottom: 0;
  }
`

const ColorInput = styled.input`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: 8px;
  }
`

const TextInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--color-input-border, #e1e5e9);
  border-radius: 6px;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: var(--color-input-focus, #667eea);
  }
`

const Label = styled.label`
  min-width: 100px;
  font-size: 0.875rem;
  color: var(--color-secondary-text, #666);
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-input-border, #e1e5e9);
`

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease
    ${props => {
      switch (props.variant) {
        case 'primary':
          return `
          background: var(--color-button-background, linear-gradient(135deg, #667eea 0%, #764ba2 100%));
          color: var(--color-button-text, #ffffff);
          
          &:hover {
            background: var(--color-button-hover, linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%));
            transform: translateY(-1px);
          }
        `
        case 'danger':
          return `
          background: var(--color-error, #f56565);
          color: white;
          
          &:hover {
            background: #e53e3e;
            transform: translateY(-1px);
          }
        `
        default:
          return `
          background: transparent;
          color: var(--color-secondary-text, #666);
          border: 1px solid var(--color-input-border, #e1e5e9);
          
          &:hover {
            background: var(--color-input-border, #e1e5e9);
          }
        `
      }
    }};
`

const ColorSchemeEditor: React.FC<ColorSchemeEditorProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    currentScheme,
    setCurrentScheme,
    saveCustomScheme,
    deleteCustomScheme,
  } = useColorScheme()
  const allSchemes = useAllColorSchemes()
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets')
  const [editingScheme, setEditingScheme] = useState<ColorScheme | null>(null)
  const [customSchemeName, setCustomSchemeName] = useState('')

  useEffect(() => {
    if (isOpen) {
      setEditingScheme(null)
      setCustomSchemeName('')
    }
  }, [isOpen])

  const handleSchemeSelect = (scheme: ColorScheme) => {
    setCurrentScheme(scheme)
  }

  const startCustomizing = () => {
    setEditingScheme({
      ...currentScheme,
      id: `custom-${Date.now()}`,
      name: customSchemeName || 'Custom Scheme',
    })
    setActiveTab('custom')
  }

  const handleColorChange = (
    category: keyof ColorScheme['colors'],
    value: string
  ) => {
    if (!editingScheme) return

    setEditingScheme(prev =>
      prev
        ? {
            ...prev,
            colors: {
              ...prev.colors,
              [category]: value,
            },
          }
        : null
    )
  }

  const handleShadowChange = (
    category: keyof ColorScheme['shadows'],
    value: string
  ) => {
    if (!editingScheme) return

    setEditingScheme(prev =>
      prev
        ? {
            ...prev,
            shadows: {
              ...prev.shadows,
              [category]: value,
            },
          }
        : null
    )
  }

  const saveCustom = () => {
    if (!editingScheme) return

    const schemeToSave = {
      ...editingScheme,
      name: customSchemeName || editingScheme.name,
    }
    saveCustomScheme(schemeToSave)
    setCurrentScheme(schemeToSave)
    setEditingScheme(null)
    setCustomSchemeName('')
  }

  const handleDelete = (schemeId: string) => {
    if (window.confirm('Are you sure you want to delete this custom scheme?')) {
      deleteCustomScheme(schemeId)
    }
  }

  if (!isOpen) return null

  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Header>
          <Title>Color Scheme Editor</Title>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </Header>

        <TabContainer>
          <Tab
            active={activeTab === 'presets'}
            onClick={() => setActiveTab('presets')}
          >
            Preset Schemes
          </Tab>
          <Tab
            active={activeTab === 'custom'}
            onClick={() => setActiveTab('custom')}
          >
            Custom Scheme
          </Tab>
        </TabContainer>

        {activeTab === 'presets' && (
          <>
            <SchemeGrid>
              {allSchemes.map(scheme => (
                <SchemeCard
                  key={scheme.id}
                  isActive={currentScheme.id === scheme.id}
                  onClick={() => handleSchemeSelect(scheme)}
                >
                  <SchemePreview background={scheme.colors.pageBackground} />
                  <SchemeName>{scheme.name}</SchemeName>
                  {!presetColorSchemes.find(p => p.id === scheme.id) && (
                    <Button
                      variant='danger'
                      onClick={e => {
                        e.stopPropagation()
                        handleDelete(scheme.id)
                      }}
                      style={{
                        marginTop: '0.5rem',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                      }}
                    >
                      Delete
                    </Button>
                  )}
                </SchemeCard>
              ))}
            </SchemeGrid>

            <ButtonGroup>
              <TextInput
                placeholder='Custom scheme name'
                value={customSchemeName}
                onChange={e => setCustomSchemeName(e.target.value)}
                style={{ marginRight: 'auto', maxWidth: '200px' }}
              />
              <Button onClick={startCustomizing}>Create Custom Scheme</Button>
            </ButtonGroup>
          </>
        )}

        {activeTab === 'custom' && editingScheme && (
          <>
            <ColorInputGrid>
              <ColorGroup>
                <ColorGroupTitle>Background Colors</ColorGroupTitle>
                <ColorInputRow>
                  <Label>Page Background:</Label>
                  <TextInput
                    value={editingScheme.colors.pageBackground}
                    onChange={e =>
                      handleColorChange('pageBackground', e.target.value)
                    }
                    placeholder='e.g., #667eea or linear-gradient(...)'
                  />
                </ColorInputRow>
                <ColorInputRow>
                  <Label>Card Background:</Label>
                  <TextInput
                    value={editingScheme.colors.cardBackground}
                    onChange={e =>
                      handleColorChange('cardBackground', e.target.value)
                    }
                    placeholder='e.g., rgba(255,255,255,0.95)'
                  />
                </ColorInputRow>
              </ColorGroup>

              <ColorGroup>
                <ColorGroupTitle>Text Colors</ColorGroupTitle>
                <ColorInputRow>
                  <Label>Primary Text:</Label>
                  <ColorInput
                    type='color'
                    value={
                      editingScheme.colors.primaryText.startsWith('#')
                        ? editingScheme.colors.primaryText
                        : '#1a202c'
                    }
                    onChange={e =>
                      handleColorChange('primaryText', e.target.value)
                    }
                  />
                  <TextInput
                    value={editingScheme.colors.primaryText}
                    onChange={e =>
                      handleColorChange('primaryText', e.target.value)
                    }
                  />
                </ColorInputRow>
                <ColorInputRow>
                  <Label>Secondary Text:</Label>
                  <ColorInput
                    type='color'
                    value={
                      editingScheme.colors.secondaryText.startsWith('#')
                        ? editingScheme.colors.secondaryText
                        : '#666666'
                    }
                    onChange={e =>
                      handleColorChange('secondaryText', e.target.value)
                    }
                  />
                  <TextInput
                    value={editingScheme.colors.secondaryText}
                    onChange={e =>
                      handleColorChange('secondaryText', e.target.value)
                    }
                  />
                </ColorInputRow>
                <ColorInputRow>
                  <Label>Title Gradient:</Label>
                  <TextInput
                    value={editingScheme.colors.titleGradient}
                    onChange={e =>
                      handleColorChange('titleGradient', e.target.value)
                    }
                    placeholder='linear-gradient(...)'
                  />
                </ColorInputRow>
              </ColorGroup>

              <ColorGroup>
                <ColorGroupTitle>Button Colors</ColorGroupTitle>
                <ColorInputRow>
                  <Label>Button Background:</Label>
                  <TextInput
                    value={editingScheme.colors.buttonBackground}
                    onChange={e =>
                      handleColorChange('buttonBackground', e.target.value)
                    }
                    placeholder='Color or gradient'
                  />
                </ColorInputRow>
                <ColorInputRow>
                  <Label>Button Text:</Label>
                  <ColorInput
                    type='color'
                    value={
                      editingScheme.colors.buttonText.startsWith('#')
                        ? editingScheme.colors.buttonText
                        : '#ffffff'
                    }
                    onChange={e =>
                      handleColorChange('buttonText', e.target.value)
                    }
                  />
                  <TextInput
                    value={editingScheme.colors.buttonText}
                    onChange={e =>
                      handleColorChange('buttonText', e.target.value)
                    }
                  />
                </ColorInputRow>
                <ColorInputRow>
                  <Label>Button Hover:</Label>
                  <TextInput
                    value={editingScheme.colors.buttonHover}
                    onChange={e =>
                      handleColorChange('buttonHover', e.target.value)
                    }
                    placeholder='Color or gradient'
                  />
                </ColorInputRow>
              </ColorGroup>

              <ColorGroup>
                <ColorGroupTitle>Form Elements</ColorGroupTitle>
                <ColorInputRow>
                  <Label>Input Border:</Label>
                  <ColorInput
                    type='color'
                    value={
                      editingScheme.colors.inputBorder.startsWith('#')
                        ? editingScheme.colors.inputBorder
                        : '#e1e5e9'
                    }
                    onChange={e =>
                      handleColorChange('inputBorder', e.target.value)
                    }
                  />
                  <TextInput
                    value={editingScheme.colors.inputBorder}
                    onChange={e =>
                      handleColorChange('inputBorder', e.target.value)
                    }
                  />
                </ColorInputRow>
                <ColorInputRow>
                  <Label>Input Focus:</Label>
                  <ColorInput
                    type='color'
                    value={
                      editingScheme.colors.inputFocus.startsWith('#')
                        ? editingScheme.colors.inputFocus
                        : '#667eea'
                    }
                    onChange={e =>
                      handleColorChange('inputFocus', e.target.value)
                    }
                  />
                  <TextInput
                    value={editingScheme.colors.inputFocus}
                    onChange={e =>
                      handleColorChange('inputFocus', e.target.value)
                    }
                  />
                </ColorInputRow>
                <ColorInputRow>
                  <Label>Input Background:</Label>
                  <ColorInput
                    type='color'
                    value={
                      editingScheme.colors.inputBackground.startsWith('#')
                        ? editingScheme.colors.inputBackground
                        : '#ffffff'
                    }
                    onChange={e =>
                      handleColorChange('inputBackground', e.target.value)
                    }
                  />
                  <TextInput
                    value={editingScheme.colors.inputBackground}
                    onChange={e =>
                      handleColorChange('inputBackground', e.target.value)
                    }
                  />
                </ColorInputRow>
              </ColorGroup>
            </ColorInputGrid>

            <ButtonGroup>
              <TextInput
                placeholder='Scheme name'
                value={customSchemeName}
                onChange={e => setCustomSchemeName(e.target.value)}
                style={{ marginRight: 'auto', maxWidth: '200px' }}
              />
              <Button onClick={() => setEditingScheme(null)}>Cancel</Button>
              <Button variant='primary' onClick={saveCustom}>
                Save Custom Scheme
              </Button>
            </ButtonGroup>
          </>
        )}
      </Modal>
    </Overlay>
  )
}

export default ColorSchemeEditor
